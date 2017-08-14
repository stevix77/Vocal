import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalEditVocalPage } from './modal-edit-vocal';

@NgModule({
  declarations: [
    ModalEditVocalPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalEditVocalPage),
  ],
  exports: [
    ModalEditVocalPage
  ]
})
export class ModalEditVocalPageModule {}
