import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { Map } from '../map/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Products } from '../products/products'
import { DataService } from '../../providers/data.service'
import { AuthService } from '../../providers/auth.service'
import { User } from 'firebase/app'


@Component({
  selector: 'page-company_details',
  templateUrl: 'company_details.html'
})
export class CompanyDetailsPage {

  selectedItem: any;
  db: SQLiteObject;

  constructor(public navCtrl: NavController, public navParams: NavParams,private sqlstorage: SQLite,
              private alert:AlertController,
              private socialSharing:SocialSharing,
              private dataService:DataService,
              private auth:AuthService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    console.log(this.selectedItem.headquarters.latitude);
  }
  ionViewWillEnter(){
    document.getElementById('main_header').hidden = true;
  }


  addToLocal(company) {
    this.db.executeSql("select * from companies where name=\"" + company.name + "\"", {})
      .then((data) => {
        //console.log(JSON.stringify(data));
       // this.showAlert('data',JSON.stringify(data.rows.item(0)));
        if(data.rows.length==0) {
          this.db.executeSql('INSERT INTO companies (name,latitude,longitude) VALUES (\"' +
            company.name + "\",\"" + company.headquarters.latitude + "\",\"" + company.headquarters.longitude + "\");", {});

          for (let i = 0; i < company.departments.length; i++) {
            this.db.executeSql('INSERT INTO companies (name,latitude,longitude) VALUES (\"' +
              company.name + "\",\"" + company.departments[i].latitude + "\",\"" + company.departments[i].longitude + "\");", {});
          }
          this.showAlert('Success', 'Added to favourites');
        }
        else {
          this.showAlertForRemove('Already favorite','Selected company is already favorite. Do you want to remove it?',company);
        }
      })

  }

 async addToFavourite(company) {
     this.auth.getAuthenticatedUser().subscribe((user:User)=> {
        const result = this.dataService.saveFavCompany(user,company._id);
        if(result) {
          this.showAlert("Success","Company added to favourites");
          return;
        } else {
            this.showAlert("Error","Error while adding company to favourites");
            return;
        }
  })
  
 }

  showOnMap(latitude,longitude)
  {
    let array = [
      {lat:this.selectedItem.headquarters.latitude,long:this.selectedItem.headquarters.longitude,name:this.selectedItem.name}
    ];
    this.navCtrl.push(Map, {
     arr:array
    });
  }

  showProducts(selectedItem) {
    this.navCtrl.push(Products,{
      company_id:this.selectedItem._id
    });
  }

  showAlert(title,subtitle) {
    let alert = this.alert.create({
      title: title,
      message: subtitle,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
  showAlertForRemove(title,subtitle,company) {
    let alert = this.alert.create({
      title: title,
      message: subtitle,
      buttons: [
        {
          text: 'Yes',
         // role: 'cancel',
          handler: () => {
            this.db.executeSql('Delete from companies where name = \"' + company.name + "\";", {});

          }
        },
        {
          text: 'No',
          role: 'cancel',
        }
      ]

    });
    alert.present(prompt);
  }
  regularShare(){
    // share(message, subject, file, url)
    this.socialSharing.share("Hey, check out this company: " +this.selectedItem.name + "\n" + this.selectedItem.email, null, "www/assets/icon/favicon.ico", null);
  }
  twitterShare(){
    this.socialSharing.shareViaTwitter("Hey, check out this company: " +this.selectedItem.name + "\n" + this.selectedItem.email, "www/assets/icon/favicon.ico", null);
  }
  instagramShare(){
    this.socialSharing.shareViaInstagram("Hey, check out this company: " +this.selectedItem.name + "\n" + this.selectedItem.email, "www/assets/icon/favicon.ico");
  }
  whatsappShare(){
    this.socialSharing.shareViaWhatsApp("Hey, check out this company: " +this.selectedItem.name + "\n" + this.selectedItem.email, "www/assets/icon/favicon.ico", null);
  }


}
