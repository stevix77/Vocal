import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendsListPage } from './friends-list';

@NgModule({
  declarations: [
    FriendsListPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendsListPage),
  ],
  exports: [
    FriendsListPage
  ]
})
export class FriendsListPageModule {}
