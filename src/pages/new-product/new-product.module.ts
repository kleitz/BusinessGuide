import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewProduct } from './new-product';

@NgModule({
  declarations: [
    NewProduct,
  ],
  imports: [
    IonicPageModule.forChild(NewProduct),
  ],
  exports: [
    NewProduct
  ]
})
export class NewProductModule {}
