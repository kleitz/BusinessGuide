import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase,FirebaseObjectObservable,FirebaseListObservable } from 'angularfire2/database';
import {User} from 'firebase/app';
import { Profile } from '../models/profile/profile.interface';
import { Message } from '../models/message/message.interface';
import firebase from 'firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {AuthService} from '../providers/auth.service';

@Injectable()
export class Messages {

  hasMessages : boolean;
  user:User;
  messageObject : FirebaseObjectObservable<Message> 
  oldMessageObject : FirebaseObjectObservable<Message> 
  globalMessageObject : FirebaseObjectObservable<Message> 

  constructor(private database:AngularFireDatabase,
  private localNotifications: LocalNotifications,
  private auth:AuthService) 
  {
    
  }

  getMessagesRef() {
    this.auth.getAuthenticatedUser().subscribe((user:User)=> {
      this.user = user;
      let reportRef = firebase.database().ref('/user-messages/'+this.user.uid).orderByKey();
      reportRef.on('child_added', function(data) {
        console.log("nova poruka");
        this.hasMessages = true;
        return true;
      });
    });
    this.hasMessages = false;
    return false;
  }
  getNewMessages(): FirebaseListObservable<Message[]> {
  return this.database.list('/user-messages/'+this.user.uid+'/new-messages');
}
 getOldMessages(): FirebaseListObservable<Message[]> {
  return this.database.list('/user-messages/'+this.user.uid+'/old-messages');
}

async sendMessage(message) {
  let key = new Date().getTime();
  message.key = key;
  console.log(message.message);
  this.globalMessageObject = this.database.object('/messages/'+key);
  try {
    await this.globalMessageObject.set(message);
    
    return true;
  }
  catch(e) {
    console.log(e);
    return false;
  }
}

  async saveToOldMessages(message:Message) {
    console.log("save"+message.key);
     this.messageObject = this.database.object('/user-messages/'+this.user.uid+'/old-messages/'+message.key);
     try {
       await this.messageObject.set(message);
       return true;
     }
     catch(e) {
       console.log(e);
       return false;
     }
  }
  async removeFromNewMessages(message:Message) {
     console.log("del"+message.key);
     console.log(this.user.uid);
    // this.oldMessageObject = this.database.object('/user-messages/d4ztMmmdhhYOIDjntZciP6o3Nq12/new-messages/random-key2');
   //('/user-messages/'+this.user.uid+'/new-messages/'+message.key+'/message');
    this.oldMessageObject = this.database.object('/user-messages/'+this.user.uid+'/new-messages/'+message.key);

     try {
      // await this.globalMessageObject.remove();
       await this.oldMessageObject.remove();
     }
       catch(e) {
       console.log(e);
       return false;
     }
  }

  async moveFromNewToOld(message) {
   try{ 
     await this.saveToOldMessages(message);
     await this.removeFromNewMessages(message);
     return true;
   }
   catch(e) {
     console.log(e);
     return false;
   }
  }
  
}
