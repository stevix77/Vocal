import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injectable, Injector } from '@angular/core';
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
import { Deeplinks } from '@ionic-native/deeplinks';

import { AudioFiltersPage } from '../pages/audio-filters/audio-filters';
import { FriendsListPage } from '../pages/friends-list/friends-list';
import { AddFriendPage } from '../pages/add-friend/add-friend';
import { SearchUsernamePage } from '../pages/search-username/search-username';
import { SearchMailPage } from '../pages/search-mail/search-mail';
import { PopoverFriendsAddedMePage } from '../pages/popover-friends-added-me/popover-friends-added-me';

import { StoreService } from '../services/storeService';
import { HttpService } from "../services/httpService";
import { CookieService } from "../services/cookieService";
import { ExceptionService } from "../services/exceptionService";
import { TalkService } from "../services/talkService";
import { HubService } from "../services/hubService";
import { Camera } from "@ionic-native/camera";
import { FriendsService } from "../services/friendsService";
import { InitService } from "../services/initService";
import { ScanContactsPage } from "../pages/scan-contacts/scan-contacts";
import { AudioRecorder } from "../services/audiorecorder";
import { SettingsService } from "../services/settingsService";

import { Pro } from '@ionic/pro';

Pro.init('6a79ec67', {
  appVersion: '0.0.1'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

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
  AudioFiltersPage,
  FriendsListPage,
  AddFriendPage,
  SearchUsernamePage,
  SearchMailPage,
  PopoverFriendsAddedMePage,
  ScanContactsPage
];

@NgModule({
  declarations: components,
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(VocalApp, {
      backButtonText: ''
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: components,
  providers: [
    StatusBar,
    SplashScreen,
    Media,
    File,
    Camera,
    Deeplinks,
    StoreService,
    CookieService,
    HttpService,
    TalkService,
    HubService,
    ExceptionService,
    FriendsService,
    SettingsService,
    InitService,
    AudioRecorder,
    IonicErrorHandler,
    {provide: ErrorHandler, useClass: MyErrorHandler}
  ]
})
export class AppModule {}
