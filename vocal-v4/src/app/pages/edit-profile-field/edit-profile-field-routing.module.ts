import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProfileFieldPage } from './edit-profile-field.page';

const routes: Routes = [
  {
    path: '',
    component: EditProfileFieldPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProfileFieldPageRoutingModule {}
