import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { VocalListPage } from '../pages/vocal-list/vocal-list'
import { PasswordForgotPage } from '../pages/passwordForgot/passwordForgot';
import { Connexion } from '../pages/connexion/connexion';
import { Inscription } from '../pages/inscription/inscription';
import { InscriptionBirthdayPage } from '../pages/inscription-birthday/inscription-birthday';
import { InscriptionFindFriendsPage } from '../pages/inscription-find-friends/inscription-find-friends';
import { StoreService } from '../services/storeService';
import {url} from '../services/url';
import {HttpService} from '../services/httpService';
import { Globalization } from '@ionic-native/globalization';
import {params} from '../services/params';
import {Response} from '../models/response';
import {ResourceResponse} from '../models/Response/resourceResponse';


@Component({
  templateUrl: 'app.html',
  providers: [StoreService, HttpService, Globalization]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storeService: StoreService, private httpService: HttpService, private globalization: Globalization) {
    this.GetAllResources();
    this.storeService.Get("user").then(
      user => {
        if(user != null)
          this.rootPage = VocalListPage;
        else
          this.rootPage = HomePage;
      }
    ).catch(error => {
      console.log(error);
      this.rootPage = HomePage;
    });
    this.SetLanguage();
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'PasswordForgot', component: PasswordForgotPage },
      { title: 'Connexion', component: Connexion },
      { title: 'Inscription', component: Inscription },
      { title: 'InscriptionBirthday', component: InscriptionBirthdayPage }
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
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
