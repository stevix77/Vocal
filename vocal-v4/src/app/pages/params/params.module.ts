import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParamsPageRoutingModule } from './params-routing.module';

import { ParamsPage } from './params.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParamsPageRoutingModule
  ],
  declarations: [ParamsPage]
})
export class ParamsPageModule {}
