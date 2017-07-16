import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { Camera , CameraOptions} from '@ionic-native/camera'
import { AuthService } from '../../providers/auth.service'
import { DataService } from '../../providers/data.service'
import { StorageService } from '../../providers/storage.service'
import { User } from 'firebase/app';
import { Product } from '../../models/product/product.interface'
import { Mongo } from '../../providers/mongo'
import {Http,Headers,RequestOptions} from '@angular/http';
import { ip } from '../../models/ip_address/ip_address'


@IonicPage()
@Component({
  selector: 'page-new-product',
  templateUrl: 'new-product.html',
})
export class NewProduct {

  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };
  categories = [];
  subcategories = [];
  companies = [];
  products = [];
  imageUrl : string;
  new_product = {} as  Product;
  selected_company_category : any;
  selected_product_category : any;
  selected_company : any;

  private currentUser : User;
  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AuthService,
    private camera: Camera,private storageService:StorageService,private dataService: DataService,
    private alert:AlertController,private http:Http) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewProduct');
    //this.company_categories = this.mongo.getCompanyCategoriesRequest();
    //this.getCompanyCategoriesRequest();
    
  }
  ionViewWillEnter() {
      this.getCompanyCategoriesRequest();
  }


  takePicture() {
       this.camera.getPicture(this.cameraOptions)
      .then(data => {
        let base64Image = 'data:image/jpeg;base64,' + data;
        this.imageUrl = base64Image;
        return this.storageService.uploadProductImage(base64Image,this.new_product._company,this.new_product.name);
        })
        .then(data2 => {
        console.log("picture stored successfully");
         this.new_product.image=data2.downloadURL;    
    })
        
  }

  

  async saveProduct()  {
   // this.storageService.uploadProductImage(this.imageUrl,this.new_product._company,this.new_product.name).then( data => {
   //   this.new_product.image=data.downloadURL;
      this.afAuth.getAuthenticatedUser().subscribe((user:User)=> {
        const result = this.dataService.saveProduct(user,this.new_product);
        if(result) {
          
          this.showAlert("Success","Product added successfully");
          return true;
        }
        
      }) 
    this.showAlert("Error","Error while adding product");
    return false;
  //    this.afAuth.getAuthenticatedUser().subscribe((user:User)=> {
    
  //   const result = this.dataService.saveProduct(user,product);
  //   if (result) {
  //     return true;
  //   }
  // })
  // return false;
    // const result = await this.dataService.saveProduct(this.currentUser,product);
    // return result;
  }
 showAlert(title,subtitle) {
 
    let alert = this.alert.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
  compareFn(e1: string, e2: string): boolean {
  return e1 && e2 ? e1 === e2 : e1 === e2;
}
getCompanyCategoriesRequest() {
    let companyCategoriesUrl = ip+"/secure/companycategories";
        this.http.get(companyCategoriesUrl, ).subscribe((data) => {
          let json = data.json();
         
          this.categories = json;
          console.log(this.categories[0].name);
        }, error2 => {
          this.showAlert(error2, error2);
        })
       

  }
  getProductCategoriesRequest(id) {
    let productCategoriesUrl = ip+"/secure/productcategoriesbycompanycategory";
    
      
      let body = {'_id':id};
      this.http.post(productCategoriesUrl,body).subscribe((data)=> {
        let json = data.json();
        this.subcategories = json;
      },error => {
        console.log(error);
      })

    
  }
  getCompaniesByProductCategoryRequest(id){
    // let companiesUrl = "http://10.0.3.2:3000/secure/companiesbyproductcategory";
    let companiesUrl = ip+"/secure/companiesbyproductcategory";
   
      let body = {'_id': id};
      this.http.post(companiesUrl, body).subscribe((data) => {
        let json = data.json();
        this.companies = json;
      }, error => {
        console.log(error);
      })
    
  }
  getProductsByCompanyRequest(company_id) {
    // let productsurl = "http://10.0.3.2:3000/secure/productsbycompany";
    let productsurl = ip+"/secure/productsbycompany";

       
        let body = {'_id': company_id};
        this.http.post(productsurl, body).subscribe((data) => {
          let json = data.json();
          this.products = json;
        }, error => {
          console.log(error);
        })

      
    

  }

  optionsCompantCategory():void {
    this.getProductCategoriesRequest(this.selected_company_category._id);
  }

   openCategory(category) {
    this.getProductCategoriesRequest(category._id);
  }
  openSubcategory(subcategory) {
    this.getCompaniesByProductCategoryRequest(subcategory._id);
    
  }
  selectCompany(company) {
    this.new_product._company=company.name;
    this.getProductsByCompanyRequest(company._id);
  }
  selectProduct(product) {
    this.new_product.id = product._id;
    this.new_product.name = product.name;
  }


}
