import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DataService} from '../../providers/data.service';
import {AuthService} from '../../providers/auth.service';
import { Profile } from '../../models/profile/profile.interface';
import { Product } from '../../models/product/product.interface';
import { CompanyRef } from '../../models/company_ref/company.ref.interface'
import { User } from 'firebase/app';
import { FirebaseListObservable } from 'angularfire2/database';
import {Http,Headers,RequestOptions} from '@angular/http';
import { ip } from '../../models/ip_address/ip_address'
import { Geofence } from '@ionic-native/geofence';
import { Message } from '../../models/message/message.interface';
import { Messages } from '../../providers/messages.service'


@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfile {

  userProfile:Profile;
  friends: FirebaseListObservable<Profile[]>
    products: FirebaseListObservable<Product[]>
    companies: FirebaseListObservable<CompanyRef[]>
    companies_with_discount = [];
    product_with_discount = []
    companyIds = [];
    productIds = [];
    //sendingMessage: Message;
    user: User;
    message_text:string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private data:DataService,
  private auth:AuthService,
  private http:Http,
  private geofence:Geofence,
  private messageService:Messages) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProfile');
    this.auth.getAuthenticatedUser().subscribe((user:User)=> {
      this.user = user;
      this.data.getProfile(user).subscribe((profile => {
        this.userProfile = <Profile>profile.val();
        this.companies = this.data.getFavCompanies(user);
        this.companies.forEach(element => {
          element.forEach(element2 => {
            this.companyIds.push(element2.id);
          });
          
          this.getCompaniesWithDiscount();
        });
        this.friends = this.data.getUsersFriend(user);
        this.products = this.data.getUsersProducts(user);
        this.products.forEach(element => {
          element.forEach(element2 => {
            this.productIds.push(element2.id);
          });
          this.getProductsWithDiscount();
        });
      }))
    })
   
  }
 
  ionViewWillEnter() {
    // this.auth.getAuthenticatedUser().subscribe((user:User)=> {
    //   this.data.getProfile(user).subscribe((profile => {
    //     this.userProfile = <Profile>profile.val();
    //     this.friends = this.data.getUsersFriend(user);
    //   }))
    // })
  }

  sendMessageToFriend(friend) {
    let sendingMessage = {
      userFromId: this.user.uid,
      userToId : friend.id,
      message: this.message_text,
      userFromName: this.userProfile.firstname
    };
    this.messageService.sendMessage(sendingMessage);
    
  }

  startReceivingNotifications() {
    for(let j = 0;j<this.companies_with_discount.length;j++) {
      this.addGeofence(Number(this.companies_with_discount[j].headquarters.latitude),Number(this.companies_with_discount[j].headquarters.longitude),this.companies_with_discount[j].name);
       for (let i = 0; i < this.companies_with_discount[j].departments.length; i++) {
           this.addGeofence(Number(this.companies_with_discount[j].departments[i].latitude) , Number(this.companies_with_discount[j].departments[i].longitude),this.companies_with_discount[j].name);
          }
    }
  }

  private addGeofence(lat,long,name) {
  //options describing geofence
  let fence = {
    id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
    latitude:      lat, //center of geofence radius
    longitude:      long,
    radius:         100, //radius to edge of geofence in meters
    transitionType: 3, //see 'Transition Types' below
    notification: { //notification settings
        id:             1, //any unique ID
        title:          'You crossed a fence', //notification title
        text:           'You are near to'+name, //notification body
        openAppOnClick: true //open app when notification is tapped
    }
  }

  this.geofence.addOrUpdate(fence).then(
     () => console.log('Geofence added'),
     (err) => console.log('Geofence failed to add')
   );
}

openInbox() {
  this.navCtrl.push('Inbox');
}
  getCompaniesWithDiscount() {
    
     if(this.companyIds.length>0) {
   // let productCategoriesUrl = "http://10.0.3.2:3000/secure/productcategoriesbycompanycategory";
   let url = ip + "/favourite/getdiscountedcompanies";
   console.log(url);
   // let discountUrl = "http://192.168.1.5:3000/favourite/getdiscountedcompanies";
       let body = {'companies:':'['+this.companyIds.toString()+']'};
       
       this.http.post(url,body).subscribe((data)=> {
         let json = data.json();
         this.companies_with_discount = json;
         console.log(this.companies_with_discount[0].name);
       },error => {
         console.log(error);
       })
     }
    
  }
   getProductsWithDiscount() {
   // let productCategoriesUrl = "http://10.0.3.2:3000/secure/productcategoriesbycompanycategory";
   if(this.productIds.length>0) {
    //let discountUrl = "http://192.168.1.5:3000/favourite/getdiscountedproducts";
     let url = ip + "/favourite/getdiscountedcompanies";

       let body = {'products:':'['+this.productIds.toString()+']'};
       this.http.post(url,body).subscribe((data)=> {
         let json = data.json();
         console.log("prod"+json);
         this.product_with_discount = json;
       },error => {
         console.log(error);
       })
   }
    
  }
  addNewProduct() {
    this.navCtrl.push("NewProduct");
  }

}
