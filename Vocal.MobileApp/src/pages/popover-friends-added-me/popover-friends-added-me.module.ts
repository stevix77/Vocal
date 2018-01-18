import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverFriendsAddedMePage } from './popover-friends-added-me';

@NgModule({
  declarations: [
    PopoverFriendsAddedMePage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverFriendsAddedMePage),
  ],
  exports: [
    PopoverFriendsAddedMePage
  ]
})
export class PopoverFriendsAddedMePageModule {}
