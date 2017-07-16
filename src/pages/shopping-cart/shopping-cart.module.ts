import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShoppingCart } from './shopping-cart';

@NgModule({
  declarations: [
    ShoppingCart,
  ],
  imports: [
    IonicPageModule.forChild(ShoppingCart),
  ],
  exports: [
    ShoppingCart
  ]
})
export class ShoppingCartModule {}
