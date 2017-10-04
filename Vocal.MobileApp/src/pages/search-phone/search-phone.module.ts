import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPhonePage } from './search-phone';

@NgModule({
  declarations: [
    SearchPhonePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPhonePage),
  ],
  exports: [
    SearchPhonePage
  ]
})
export class SearchPhonePageModule {}
