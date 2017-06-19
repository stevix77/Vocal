import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InscriptionFindFriendsPage } from './inscription-find-friends';

@NgModule({
  declarations: [
    InscriptionFindFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(InscriptionFindFriendsPage),
  ],
  exports: [
    InscriptionFindFriendsPage
  ]
})
export class InscriptionFindFriendsPageModule {}
