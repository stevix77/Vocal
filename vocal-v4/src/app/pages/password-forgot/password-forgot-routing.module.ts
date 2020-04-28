import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordForgotPage } from './password-forgot.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordForgotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordForgotPageRoutingModule {}
