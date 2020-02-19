import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InscriptionPasswordPage } from './inscription-password';

@NgModule({
  declarations: [
    InscriptionPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(InscriptionPasswordPage),
  ],
  exports: [
    InscriptionPasswordPage
  ]
})
export class InscriptionPasswordPageModule {}
