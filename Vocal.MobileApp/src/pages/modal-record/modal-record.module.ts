import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalRecordPage } from './modal-record';

@NgModule({
  declarations: [
    ModalRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalRecordPage),
  ],
  exports: [
    ModalRecordPage
  ]
})
export class ModalRecordPageModule {}
