import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendVocalPage } from './send-vocal';

@NgModule({
  declarations: [
    SendVocalPage,
  ],
  imports: [
    IonicPageModule.forChild(SendVocalPage),
  ],
  exports: [
    SendVocalPage
  ]
})
export class SendVocalPageModule {}
