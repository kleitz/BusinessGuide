import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Inbox } from './inbox';

@NgModule({
  declarations: [
    Inbox,
  ],
  imports: [
    IonicPageModule.forChild(Inbox),
  ],
  exports: [
    Inbox
  ]
})
export class InboxModule {}
