import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Messages } from '../../providers/messages.service';
import { Message } from '../../models/message/message.interface'
import { FirebaseListObservable } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class Inbox {

  oldMessages: FirebaseListObservable<Message[]>
  newMessages: FirebaseListObservable<Message[]>
  
  constructor(public navCtrl: NavController, public navParams: NavParams,private messages:Messages) {
  }

  ionViewDidLoad() {
   this.oldMessages = this.messages.getOldMessages();
   this.newMessages = this.messages.getNewMessages();
  }

  moveToRead(msg){
    this.messages.moveFromNewToOld(msg);
  }

}
