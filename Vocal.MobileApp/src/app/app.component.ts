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
import {ResourceResponse} from '../models/Response/resourceResponse';
// import { WindowsAzure } from 'cordova-plugin-ms-azure-mobile-apps';
declare var WindowsAzure: any;
@Component({
  templateUrl: 'app.html',
  providers: [StoreService, HttpService, Globalization, Device]
})
export class VocalApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  client : any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storeService: StoreService, private httpService: HttpService, private globalization: Globalization, private device: Device) {
    
    this.storeService.Get("user").then(
      user => {
        if(user != null) {
          params.User = user;
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
            let response = resp.json() as Response<Array<ResourceResponse>>;
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

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.GetAllResources();
      this.SetLanguage();
      this.SetPlatform();
      this.client = new WindowsAzure.MobileServiceClient("https://mobileappvocal.azurewebsites.net");
      // this.client = new WindowsAzure.Messaging.NotificationHub("vocal", "Endpoint=sb://vocalnotif.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=DTSTAQTpFmB8KzmE7n496TNWUEeInaxLGtATc7Cl9Hk=");
    });
  }

  SetPlatform() {
    let platform = '';
    switch(this.device.platform) {
      case 'windows':
        platform = 'wns';
        break;
      case 'iOS':
        platform = 'apns';
        break;
      case 'android':
      case 'Android':
        platform = 'gcm';
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
