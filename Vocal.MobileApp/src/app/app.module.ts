import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { VocalApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { PasswordForgotPage } from '../pages/passwordForgot/passwordForgot';
import { PasswordForgotValidationPage } from '../pages/password-forgot-validation/password-forgot-validation';
import { Connexion } from '../pages/connexion/connexion';

import { Inscription } from '../pages/inscription/inscription';
import { InscriptionBirthdayPage } from '../pages/inscription-birthday/inscription-birthday';
import { InscriptionUsernamePage } from '../pages/inscription-username/inscription-username';
import { InscriptionEmailPage } from '../pages/inscription-email/inscription-email';
import { InscriptionPasswordPage } from '../pages/inscription-password/inscription-password';
import { InscriptionFindFriendsPage } from '../pages/inscription-find-friends/inscription-find-friends';

import { VocalListPage } from '../pages/vocal-list/vocal-list';
import { SettingsPage } from '../pages/settings/settings';

import { SettingsChoices } from '../pages/settings/settingsChoices/SettingsChoices';
import { SettingsMail } from '../pages/settings/settingsMail/SettingsMail';


import { ModalRecordPage } from '../pages/modal-record/modal-record';
import { ModalEditVocalPage } from '../pages/modal-edit-vocal/modal-edit-vocal';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

let pages = [
  VocalApp,
  HomePage,
  ListPage,
  PasswordForgotPage,
  PasswordForgotValidationPage,
  Connexion,
  
  Inscription,
  InscriptionBirthdayPage,
  InscriptionUsernamePage,
  InscriptionEmailPage,
  InscriptionPasswordPage,
  InscriptionFindFriendsPage,

  VocalListPage,
  SettingsPage,
  SettingsChoices,
  SettingsMail,
  SettingsChoices,

  ModalRecordPage,
  ModalEditVocalPage,
];

@NgModule({
  declarations: pages,
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(VocalApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
