import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

import {DataService} from '../../providers/data.service';
import {AuthService} from '../../providers/auth.service';
import { Profile } from '../../models/profile/profile.interface';
import { User } from 'firebase/app';

import { Subscription } from 'rxjs/Subscription';
@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfile {

  private authUser$ : Subscription;
  private authUser : User;
  profile = {} as Profile;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private auth:AuthService,private data:DataService) {
                this.authUser$ = this.auth.getAuthenticatedUser().subscribe((user:User) => {
                  this.authUser = user;
                  console.log(this.authUser.uid);

                })
   
  }

  async saveProfile() {
    if(this.authUser) {
      this.profile.email = this.authUser.email;
      const result = await this.data.saveProfile(this.authUser,this.profile);
      console.log(result);
      if(result) {
        this.navCtrl.push(HomePage);
      }

    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfile');
  }

  ngOnDestroy() : void {
    this.authUser$.unsubscribe();
  }



}
