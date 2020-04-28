import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordForgotPageRoutingModule } from './password-forgot-routing.module';

import { PasswordForgotPage } from './password-forgot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordForgotPageRoutingModule
  ],
  declarations: [PasswordForgotPage]
})
export class PasswordForgotPageModule {}
