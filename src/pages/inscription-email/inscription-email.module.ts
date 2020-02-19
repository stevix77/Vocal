import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InscriptionEmailPage } from './inscription-email';

@NgModule({
  declarations: [
    InscriptionEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(InscriptionEmailPage),
  ],
  exports: [
    InscriptionEmailPage
  ]
})
export class InscriptionEmailPageModule {}
