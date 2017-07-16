import { Injectable } from '@angular/core';
import { AngularFireDatabase,FirebaseObjectObservable,FirebaseListObservable } from 'angularfire2/database';
import {User} from 'firebase/app';
import { Profile } from '../models/profile/profile.interface';
import { Product } from '../models/product/product.interface'
import { CompanyRef } from '../models/company_ref/company.ref.interface'
import "rxjs/add/operator/take";

@Injectable()
export class DataService {

  profileObject : FirebaseObjectObservable<Profile> 
  productObject: FirebaseObjectObservable<Product>
  constructor(private database:AngularFireDatabase) {
  }

  getProfile(user: User) {
     this.profileObject = this.database.object('/profiles/'+user.uid, {preserveSnapshot:true});
     return this.profileObject.take(1);
  }

async saveProfile(user:User,profile:Profile) {
    
    this.profileObject = this.database.object('/profiles/'+user.uid);
    try {
   await this.profileObject.set(profile);
   return true;
  }
  catch(e) {
    console.log(e);
    return false;
  }
}

getUsersFriend(user:User): FirebaseListObservable<Profile[]> {
  return this.database.list('/profiles/'+user.uid+'/friends');
  
}

async saveProduct(user:User,product:Product) {
  this.productObject = this.database.object('/profiles/'+user.uid+'/fav_products/'+product.id);
  try {
    await this.productObject.set(product);
    return true;
  }
  catch(e) {
    console.log(e);
    return false;
  }
}

 getUsersProducts(user:User): FirebaseListObservable<Product[]> {
  return this.database.list('/profiles/'+user.uid+'/fav_products');
}

async saveFavCompany(user:User,company_id:string) {
  this.productObject = this.database.object('/profiles/'+user.uid+'/fav_companies/'+company_id);
  try {
    await this.productObject.set({"id":company_id});
  }
  catch(e) {
    console.log(e);
    return false;
  }
}

getFavCompanies(user:User): FirebaseListObservable<CompanyRef[]> {
  return this.database.list('/profiles/'+user.uid+'/fav_companies');
}

}
