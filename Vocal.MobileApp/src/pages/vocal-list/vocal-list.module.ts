import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VocalListPage } from './vocal-list';

@NgModule({
  declarations: [
    VocalListPage,
  ],
  imports: [
    IonicPageModule.forChild(VocalListPage),
  ],
  exports: [
    VocalListPage
  ]
})
export class VocalListPageModule {}
