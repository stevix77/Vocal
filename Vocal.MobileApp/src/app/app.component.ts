import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { VocalListPage } from '../pages/vocal-list/vocal-list'
import { StoreService } from '../services/storeService';
import {url} from '../services/url';
import {HttpService} from '../services/httpService';
import { Globalization } from '@ionic-native/globalization';
import { Device } from '@ionic-native/device';
import {params} from '../services/params';
import {Response} from '../models/response';
import {KeyValueResponse} from '../models/response/keyValueResponse';
import {Store} from '../models/enums';
import { CookieService } from "../services/cookieService";
import { Push, PushObject } from '@ionic-native/push';
import { NotificationRegisterRequest } from "../models/request/notificationRegisterRequest";
import { HubService } from '../services/hubService';

declare var WindowsAzure: any;

@Component({
  templateUrl: 'app.html',
  providers: [StoreService, HttpService, Globalization, Device, CookieService, Push, HubService]
})
export class VocalApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  client : any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storeService: StoreService, private httpService: HttpService, private globalization: Globalization, private device: Device, private cookieService: CookieService, private push: Push, private hubService: HubService) {
    
    this.storeService.Get("user").then(
      user => {
        if(user != null) {
          params.User = user;
          this.hubService.Start();
          this.initPushNotification();
          this.rootPage = VocalListPage;
        }
        else
          this.rootPage = HomePage;
      }
    ).catch(error => {
      console.log(error);
      this.rootPage = HomePage;
    });
    
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];

  }

  SetLanguage() {
    this.globalization.getPreferredLanguage()
    .then(res => {
      console.log(res);
      params.Lang = res.value;
    })
    .catch(e => {
      console.log(e)
      console.log(navigator.language);
      params.Lang = navigator.language;
    });
  }

  GetAllResources() {
    this.storeService.Get("resource").then(
    resource => {
      if(resource == null) {
        this.httpService.Post(url.GetListResources(params.Lang), null).subscribe(
          resp => {
            let response = resp.json() as Response<Array<KeyValueResponse<string, string>>>;
            this.storeService.Set("resource", response.Data);
            params.Resources = response.Data;
          }
        )
      }
    }
    ).catch(error => {
      console.log(error);
      this.rootPage = HomePage;
    });
  }

  RegisterToNH(registrationId) {
    let request = new NotificationRegisterRequest();
      request.Lang = params.Lang;
      request.UserId = params.User.Id;
      request.Channel = registrationId;
      request.Platform = params.Platform;
      let urlNotifRegister = url.NotificationRegister();
      let cookie = this.cookieService.GetAuthorizeCookie(urlNotifRegister, params.User)
      this.httpService.Post<NotificationRegisterRequest>(urlNotifRegister, request, cookie);
  }

  initPushNotification() {
    var pushOptions = {
      android: { senderID: '1054724390279' },
      ios: { alert: true, badge: true, sound: true },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(pushOptions);
    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      this.RegisterToNH(data.registrationId);
    });
    
    pushObject.on('notification').subscribe((data: any) => {
      console.log('data -> ' + data);
      //if user using app and push notification comes
      // if (data.additionalData.foreground) {
      //   // if application open, show popup
      //   let confirmAlert = this.alertCtrl.create({
      //     title: 'New Notification',
      //     message: data.message,
      //     buttons: [{
      //       text: 'Ignore',
      //       role: 'cancel'
      //     }, {
      //       text: 'View',
      //       handler: () => {
      //         //TODO: Your logic here
      //         this.nav.push(DetailsPage, { message: data.message });
      //       }
      //     }]
      //   });
      //   confirmAlert.present();
      // } else {
      //   //if user NOT using app and push notification comes
      //   //TODO: Your logic on click of push notification directly
      //   this.nav.push(DetailsPage, { message: data.message });
      //   console.log('Push notification clicked');
      // }
    });

    pushObject.on('error').subscribe(error => {
      console.log('Error with Push plugin' + error);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.GetAllResources();
      this.SetLanguage();
      this.SetPlatform();
      //this.client = new WindowsAzure.MobileServiceClient("https://mobileappvocal.azurewebsites.net");
    });
  }



  SetPlatform() {
    let platform = '';
    switch(this.device.platform) {
      case 'windows':
        platform = Store[Store.wns]
        break;
      case 'iOS':
        platform = Store[Store.apns];
        break;
      case 'android':
      case 'Android':
        platform = Store[Store.gcm];
        break;
      default:
        platform = '';
        break;
    }
    params.Platform = platform;
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
