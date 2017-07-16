import { Component } from '@angular/core';
import { NavController,NavParams, AlertController, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Http,Headers,RequestOptions} from '@angular/http';
import {subscribeOn} from "rxjs/operator/subscribeOn";
//import { Storage,SqlStorage } from 'ionic-framework/ionic';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Account } from '../../models/account/account.interface';


/**
 * Generated class for the Register page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class Register {
  public base64Image: string;
  createSuccess = false;
  account = {} as Account;
  registerCredentials = { email: '', password: '' , username: ''};
  constructor(public nav: NavController, public navParams: NavParams,private auth: AuthService,
              private alertCtrl: AlertController,private camera:Camera,public http:Http,
              private storage:Storage,private file:File) {
    this.storage=storage;

  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad Register');
  }
 async  register() {
    const result =await this.auth.createUserWithEmailAndPassword(this.account);
    if(!result.error) {
      console.log("User created successfully");
        this.nav.push("EditProfile");

    } 
    else {
      console.log(result.error);
    }
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }


 

}
