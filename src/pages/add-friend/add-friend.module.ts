import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFriendPage } from './add-friend';

@NgModule({
  declarations: [
    AddFriendPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFriendPage),
  ],
  exports: [
    AddFriendPage
  ]
})
export class AddFriendPageModule {}
