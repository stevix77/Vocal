import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordForgotValidationPage } from './password-forgot-validation';

@NgModule({
  declarations: [
    PasswordForgotValidationPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordForgotValidationPage),
  ],
  exports: [
    PasswordForgotValidationPage
  ]
})
export class PasswordForgotValidationPageModule {}
