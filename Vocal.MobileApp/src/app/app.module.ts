import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { VocalApp } from './app.component';
import { HomePage } from '../pages/home/home';
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

import { AudioRecorderComponent } from '../components/audio-recorder/audio-recorder';
import { ModalEditVocalPage } from '../pages/modal-edit-vocal/modal-edit-vocal';
import { ModalProfilePage } from '../pages/modal-profile/modal-profile';
import { SendVocalPage } from '../pages/send-vocal/send-vocal';
import { SelectFriendsComponent } from '../components/select-friends/select-friends';
import { MessagePage } from '../pages/message/message';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';

import { AudioFiltersPage } from '../pages/audio-filters/audio-filters';

let components = [
  VocalApp,
  HomePage,
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

  AudioRecorderComponent,
  ModalEditVocalPage,
  SendVocalPage,

  SelectFriendsComponent,
  ModalProfilePage,

  MessagePage,
  AudioFiltersPage
];

@NgModule({
  declarations: components,
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(VocalApp, {
      isApp: !document.URL.startsWith('http')
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: components,
  providers: [
    StatusBar,
    SplashScreen,
    Media,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
