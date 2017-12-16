import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectFriendsComponent } from './select-friends';

@NgModule({
  declarations: [
    SelectFriendsComponent,
  ],
  imports: [
    IonicPageModule.forChild(SelectFriendsComponent),
  ],
  exports: [
    SelectFriendsComponent
  ]
})
export class SelectFriendsComponentModule {}
