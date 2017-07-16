import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, LoadingController, Loading,Toast } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import {Http,Headers,RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { SearchPage } from '../search/search';
import { Account } from '../../models/account/account.interface';
import { HomePage } from '../home/home';
import { DataService } from '../../providers/data.service';
import {User} from 'firebase/app';
import { LoginResponse } from '../../models/login/login-response.interface';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  loading: Loading;
  registerCredentials = { email: '', password: '',username: '' };
  account = {} as Account;

  constructor(public nav: NavController, public navParams: NavParams, private auth: AuthService, private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,private http:Http,private storage:Storage,private file:File,
              private dataService:DataService ) {
    this.http = http;
    this.storage = storage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }
  public createAccount() {
    this.nav.push('RegisterPage');
  }
  async login(event: LoginResponse) { 
    const result= await this.auth.signInWithEmailAndPassword(this.account);
    if(!result.error) {
        console.log("Successfully logged in");
        this.dataService.getProfile(<User>result.result).subscribe(profile => {
          console.log(profile);
          profile.val() ? this.nav.push(HomePage) : this.nav.push('EditProfile');
        })
       // this.nav.push(HomePage);
    }
    else {
        console.log(result.error);

    }
  }
 

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
  showAlert(title,subtitle) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present(prompt);
  }



}
