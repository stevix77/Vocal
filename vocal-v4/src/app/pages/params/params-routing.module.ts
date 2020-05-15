import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamsPage } from './params.page';

const routes: Routes = [
  {
    path: '',
    component: ParamsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParamsPageRoutingModule {}
