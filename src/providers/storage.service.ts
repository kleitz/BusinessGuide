import { Injectable } from '@angular/core';
import * as firebase from 'firebase'



@Injectable()
export class StorageService {

  constructor() {

  }


  uploadProductImage(image: string,company:string, product: string): any {
    
    let storage = firebase.storage().ref();
    //let imageName = this.generateUUID();
    let imageRef = storage.child('products/'+company+'/'+product+'.jpg');
    return imageRef.putString(image, 'data_url');
  }
  getProductImage(company: string,product:string): any {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child('products/'+company+'/'+product);
    return imageRef.getDownloadURL();
  }
  private generateUUID(): string {
     function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

}
