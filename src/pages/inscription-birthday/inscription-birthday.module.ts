import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InscriptionBirthdayPage } from './inscription-birthday';

@NgModule({
  declarations: [
    InscriptionBirthdayPage,
  ],
  imports: [
    IonicPageModule.forChild(InscriptionBirthdayPage),
  ],
  exports: [
    InscriptionBirthdayPage
  ]
})
export class InscriptionBirthdayPageModule {}
