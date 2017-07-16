import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Http,Headers,RequestOptions} from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ip } from '../../models/ip_address/ip_address'


@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class Products {
  products = [];
  shoping_cart = [];
  company_id = -1;
  token;
  db: SQLiteObject;


  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, 
  private http: Http,private alert:AlertController,private sqlstorage:SQLite) {
    this.company_id = navParams.get('company_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Products');
  }

  ionViewWillEnter() {
    this.getProductsByCompanyRequest();

     this.sqlstorage.create({
      name: 'data.db',
      location: 'default'
    }).then((pom: SQLiteObject) => {
      this.db = pom;
      this.db.executeSql('create table shopping_cart(name VARCHAR(32), price DECIMAL(10,5))', {})
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  getProductsByCompanyRequest() {
    // let productsurl = "http://10.0.3.2:3000/secure/productsbycompany";
    let productsurl = ip+"/secure/productsbycompany";

       
        let body = {'_id': this.company_id};
        this.http.post(productsurl, body).subscribe((data) => {
          let json = data.json();
          this.products = json;
        }, error => {
          console.log(error);
        })

      
    

  }

  showOnMap(lat,lng) {
    let array = [
      {lat:lat,long:lng}
    ];
    this.navCtrl.push(Map, {
     arr:array
    });
  }

  addToShoppingCart(product) {
    this.db.executeSql("select * from shopping_cart where name=\"" + product.name + "\"", {})
      .then((data) => {
        //console.log(JSON.stringify(data));
       // this.showAlert('data',JSON.stringify(data.rows.item(0)));
        if(data.rows.length==0) {
          this.db.executeSql('INSERT INTO shopping_cart (name,price) VALUES (\"' +
            product.name + "\",\"" +  product.price + "\");", {});

         
          this.showAlert('Success', 'Added to favourites');
        }
        else {
          this.showAlertForRemove('Already in shopping cart','Selected product is already in shopping cart. Do you want to remove it?',product);
        }
      })
  }


  openShoppingCart() {
    this.navCtrl.push("ShoppingCart");
  }

  
  showAlertForRemove(title,subtitle,product) {
    let alert = this.alert.create({
      title: title,
      message: subtitle,
      buttons: [
        {
          text: 'Yes',
         // role: 'cancel',
          handler: () => {
              this.db.executeSql('Delete from shopping_cart where name = \"' + product.name + "\";", {});
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

  showAlert(title,subtitle) {
    let alert = this.alert.create({
      title: title,
      message: subtitle,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
