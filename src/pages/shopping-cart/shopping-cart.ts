import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


/**
 * Generated class for the ShoppingCart page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCart {

  db: SQLiteObject;
  shopping_cart = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,private sqlstorage:SQLite,
              private alert:AlertController) {
  }

  ionViewDidLoad() {
    this.sqlstorage.create({
      name: 'data.db',
      location: 'default'
    }).then((pom: SQLiteObject) => {
      this.db = pom;
      this.db.executeSql('create table if not exists shopping_cart (name VARCHAR(32), price DECIMAL(10,5))', {})
        .then(() => {
        })
        .catch(e => this.showAlert('create error',e));
    }).catch(e => this.showAlert('get db error',e));
  }
  ionViewWillEnter(){
    this.db.executeSql('select * from shopping_cart group by name;',{})
      .then((data)=> {
      this.shopping_cart=[];
        for(let i = 0;i<data.rows.length;i++){
          this.shopping_cart.push(data.rows.item(i));
        }
      })
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
