import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class Mongo {

url : string = "http://192.168.1.3:3000/secure/companycategories";
array = [];
  constructor(public http: Http) {
    console.log('Hello Mongo Provider');
  }

  getCompanyCategoriesRequest():any{
   // this.showAlert('upao','upao');
   //  let companyCategoriesUrl = "http://10.0.3.2:3000/secure/companycategories";
   // let companyCategoriesUrl = "http://192.168.1.3:3000/secure/companycategories";

   
        this.http.get(this.url).subscribe((data) => {
          let json = data.json();
         // this.showAlert('json', json);
          this.array=  json;
          return this.array;
          
        }, error2 => {
         // this.showAlert(error2, error2);
         
        })
    
  

  }
  // getProductCategoriesRequest(id) {
  //  // let productCategoriesUrl = "http://10.0.3.2:3000/secure/productcategoriesbycompanycategory";
  //   let productCategoriesUrl = "http://192.168.1.3:3000/secure/productcategoriesbycompanycategory";
  //   if(this.token) {
  //     let hdrs = new Headers({'token':this.token});
  //     let body = {'_id':id};
  //     this.http.post(productCategoriesUrl,body,{headers:hdrs}).subscribe((data)=> {
  //       let json = data.json();
  //       this.subcategories = json;
  //     },error => {
  //       console.log(error);
  //     })

  //   }
  // }
  // getCompaniesByProductCategoryRequest(id){
  //   // let companiesUrl = "http://10.0.3.2:3000/secure/companiesbyproductcategory";
  //   let companiesUrl = "http://192.168.1.3:3000/secure/companiesbyproductcategory";
  //   if (this.token) {
  //     let hdrs = new Headers({'token': this.token});
  //     let body = {'_id': id};
  //     this.http.post(companiesUrl, body, {headers: hdrs}).subscribe((data) => {
  //       let json = data.json();
  //       this.companies = json;
  //     }, error => {
  //       console.log(error);
  //     })
  //   }
  // }

}
