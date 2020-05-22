import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfileFieldPageRoutingModule } from './edit-profile-field-routing.module';

import { EditProfileFieldPage } from './edit-profile-field.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfileFieldPageRoutingModule
  ],
  declarations: [EditProfileFieldPage]
})
export class EditProfileFieldPageModule {}
