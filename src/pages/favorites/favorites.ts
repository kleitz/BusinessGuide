import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Map } from '../map/map';

/**
 * Generated class for the Favorites page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class Favorites {
  db: SQLiteObject;
  latitude = { min: '', max: ''};
  longitude = {min: '',max: ''};
   q:string = '';
  favcompanies= [];
  constructor(public navCtrl: NavController, public navParams: NavParams,private sqlstorage: SQLite,private alert:AlertController) {
  }

  ionViewDidLoad() {
    this.sqlstorage.create({
      name: 'data.db',
      location: 'default'
    }).then((pom: SQLiteObject) => {
      this.db = pom;
      this.db.executeSql('create table if not exists companies (name VARCHAR(32), latitude VARCHAR(20), longitude VARCHAR(20))', {})
        .then(() => {
        })
        .catch(e => this.showAlert('create error',e));
    }).catch(e => this.showAlert('get db error',e));
  }
  ionViewWillEnter(){
    this.db.executeSql('select * from companies group by name;',{})
      .then((data)=> {
      this.favcompanies=[];
        for(let i = 0;i<data.rows.length;i++){
          this.favcompanies.push(data.rows.item(i));
        }
      })
  }

  search() {
    let querry= "select * from companies";
    let hasOne = false;
    if(this.q) {
      if (hasOne) {
        querry += " and ";
      }
      else {
        querry += " where ";
        hasOne = true;
      }
      querry+="LOWER(name) like\"%" + this.q.toLowerCase() + "%\" ";
    }
    if (this.latitude.min) {
      if (hasOne) {
        querry += " and ";
      }
      else {
        querry += " where ";
        hasOne = true;
      }
      querry+="latitude>=\"" + this.latitude.min + "\" ";
    }
    if (this.latitude.max) {
      if (hasOne) {
        querry += " and ";
      }
      else {
        querry += " where ";
        hasOne = true;
      }
      querry+="latitude<=\"" + this.latitude.max + "\" ";
    }
    if (this.longitude.min) {
      if (hasOne) {
        querry += " and ";
      }
      else {
        querry += " where ";
        hasOne = true;
      }
      querry+="longitude>=\"" + this.longitude.min + "\" ";
    }
    if (this.longitude.max) {
      if (hasOne) {
        querry += " and ";
      }
      else {
        querry += " where ";
        hasOne = true;
      }
      querry+="longitude<=\"" + this.longitude.max + "\" ";
    }
    querry += " GROUP BY name;";

    this.db.executeSql(querry, {})
      .then((data) => {
        this.favcompanies=[];
      for(let i = 0;i<data.rows.length;i++){
        this.favcompanies.push(data.rows.item(i));
      }
          //this.favcompanies = data.rows.items;
      }).catch(e => this.showAlert("Error applying filter", e));
  }
  getItems(searchbar) {
     this.q = searchbar.srcElement.value;

  }
  showAlert(title,subtitle) {
    let alert = this.alert.create({
      title: title,
      message: subtitle,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
  showOnMap(latitude,longitude)
  {
    let array = [
      {lat:latitude,long:longitude}
    ];
    this.navCtrl.push(Map, {
      arr:array
    });
  }


}
