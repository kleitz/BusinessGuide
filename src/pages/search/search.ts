import { Component } from '@angular/core';
import { NavController,NavParams,AlertController  } from 'ionic-angular';
import { CompanyDetailsPage } from '../company_details/company_details';
import { TabsPage } from '../tabs/tabs';
import { Favorites } from '../favorites/favorites'
import {Http,Headers,RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ip } from '../../models/ip_address/ip_address'

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

 // categories: Array<{title: string, component: any,clicked: boolean}>;
 // subcategories: Array<{title: string}>;
  db: SQLiteObject;
  categories = [];
  subcategories = [];
  token:string;
  myInput = { val1: '', val2: ''};
  query: string = "";
  companies = [];
  public companies_holder = [];
  constructor(public navCtrl: NavController,public navParams: NavParams,private storage: Storage,private http:Http,
              private alert:AlertController, private sqlstorage: SQLite) {


  }
  ionViewWillEnter(){
    document.getElementById('main_header').hidden = false;
    document.getElementById('menu_button').hidden = false;
    this.getCompanyCategoriesRequest();
	//this.companies = this.navParams.get('companies');


    this.sqlstorage.create({
      name: 'data.db',
      location: 'default'
    }).then((pom: SQLiteObject) => {
      this.db = pom;
      this.db.executeSql('create table companies(name VARCHAR(32), latitude VARCHAR(20), longitude VARCHAR(20))', {})
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  //kad se klikne na view za kompaniju neku
  itemTapped(event,item)
  {
	  this.navCtrl.push(CompanyDetailsPage, {
      item: item
    });
  }

  //za searchbar f-ja
  getItems(searchbar) {
    this.companies = this.companies_holder;
    var q = searchbar.srcElement.value;
    if (q.trim() == '') {
      return;
    }
    this.companies = this.companies.filter(function (obj) {
      return obj.title.includes(q)
    });


  }
  openCategory(category) {
    this.getProductCategoriesRequest(category._id);
  }
  openSubcategory(subcategory) {
    this.getCompaniesByProductCategoryRequest(subcategory._id);
    this.companies_holder = this.companies;
  }

  getCompanyCategoriesRequest() {
   // this.showAlert('upao','upao');
   //  let companyCategoriesUrl = "http://10.0.3.2:3000/secure/companycategories";
    let companyCategoriesUrl = ip+"/secure/companycategories";

  
        this.http.get(companyCategoriesUrl, ).subscribe((data) => {
          let json = data.json();
         // this.showAlert('json', json);
          this.categories = json;
          console.log(this.categories[0].name);
        }, error2 => {
          this.showAlert(error2, error2);
        })
       

  }
  getProductCategoriesRequest(id) {
   // let productCategoriesUrl = "http://10.0.3.2:3000/secure/productcategoriesbycompanycategory";
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
  showAlert(title,subtitle) {
    let alert = this.alert.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
  openFavorites() {
    this.navCtrl.push(Favorites);
  }


}
