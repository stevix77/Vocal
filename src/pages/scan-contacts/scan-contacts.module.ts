import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanContactsPage } from './scan-contacts';

@NgModule({
  declarations: [
    ScanContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(ScanContactsPage),
  ],
  exports: [
    ScanContactsPage
  ]
})
export class ScanContactsPageModule {}
