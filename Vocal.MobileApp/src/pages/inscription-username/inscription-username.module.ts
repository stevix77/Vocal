import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InscriptionUsernamePage } from './inscription-username';

@NgModule({
  declarations: [
    InscriptionUsernamePage,
  ],
  imports: [
    IonicPageModule.forChild(InscriptionUsernamePage),
  ],
  exports: [
    InscriptionUsernamePage
  ]
})
export class InscriptionUsernamePageModule {}
