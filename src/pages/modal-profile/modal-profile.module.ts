import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalProfilePage } from './modal-profile';

@NgModule({
  declarations: [
    ModalProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalProfilePage),
  ],
  exports: [
    ModalProfilePage
  ]
})
export class ModalProfilePageModule {}
