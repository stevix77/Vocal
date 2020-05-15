import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StoreService } from './services/store.service';
import { KeyStore } from './models/enums';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storeService: StoreService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready()
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    try {
      const user = await this.storeService.get(KeyStore[KeyStore.User])
      if(user !== null) {
        this.authService.isLoggedIn = true;
      }
    } catch(e) {
      console.error(e);
    }
  }
}
