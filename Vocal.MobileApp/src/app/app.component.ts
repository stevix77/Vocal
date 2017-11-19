import { TalkService } from './../services/talkService';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, Config, Events, ToastController } from 'ionic-angular';
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
import {KeyStore} from '../models/enums';
import {HubMethod} from '../models/enums';
import { InitResponse } from '../models/response/InitResponse';
import { Request } from "../models/request/Request";
import { ExceptionService } from "../services/exceptionService";
import { MessagePage } from "../pages/message/message";
import { Deeplinks } from '@ionic-native/deeplinks';
import { Inscription } from "../pages/inscription/inscription";
import { InitService } from "../services/initService";

declare var WindowsAzure: any;

@Component({
  templateUrl: 'app.html',
  providers: [Globalization, Device, Push]
})
export class VocalApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  client : any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              public config: Config, 
              private storeService: StoreService, 
              private httpService: HttpService, 
              private globalization: Globalization, 
              private device: Device, 
              private cookieService: CookieService, 
              private push: Push, 
              private hubService: HubService, 
              private alertCtrl: AlertController,
              private events: Events,
              private talkService: TalkService,
              private toastCtrl: ToastController,
              private exceptionService: ExceptionService,
              private deeplinks: Deeplinks,
              private initService: InitService, ) {
    this.initializeApp();
    events.subscribe("ErrorInit", (error) => this.showToast(error));
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];

  }

  SetLanguage() {
    this.globalization.getPreferredLanguage()
    .then(res => {
      params.Lang = res.value;
    })
    .catch(e => {
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
      this.httpService.Post<NotificationRegisterRequest>(urlNotifRegister, request, cookie).subscribe(
        resp => {
          this.storeService.Set("registration", registrationId);
        }
      );
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
      this.storeService.Get("registration").then((r) => {
        if(r == null || r != data.registrationId)
          this.RegisterToNH(data.registrationId);
      })
      
    });
    
    pushObject.on('notification').subscribe((data: any) => {
      console.log('data -> ' + data);
      switch(params.Platform) {
        case "gcm":
          this.androidNotification(data);
          break;
        case "apns":
          this.iosNotification(data);
          break;
        case "wns":
          this.windowsNotification(data);
          break;
        default:
          break;
      }
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

  windowsNotification(notification) {
      let args = notification.additionalData.pushNotificationReceivedEventArgs.toastNotification.content.getElementsByTagName('toast')[0].getAttribute('launch') as string;
      let value = args.split('=')[1];
    if(notification.additionalData.coldstart) {
      this.nav.push(MessagePage, {TalkId: value})
    } else {
      let confirmAlert = this.alertCtrl.create({
        title: notification.title,
        message: notification.message,
        buttons: [{
          text: 'Ignore',
          role: 'cancel'
        }, {
          text: 'View',
          handler: () => {
            //TODO: Your logic here
            this.nav.push(MessagePage, {TalkId: value});
          }
        }]
      });
      confirmAlert.present();
    }
  }

  iosNotification(notification) {
    
  }

  androidNotification(notification) {
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storeService.Get(KeyStore[KeyStore.User]).then(
      user => {
        if(user != null) {
          params.User = user;
          this.SubscribeHub();
          this.initPushNotification();
          this.init();
          this.rootPage = VocalListPage;
        }
        else
          this.rootPage = HomePage;
        }
      ).catch(error => {
        console.log(error);
        this.rootPage = HomePage;
      });
      this.deeplinks.routeWithNavController(this.nav, {
        '/test': Inscription
      }).subscribe(match => {
        console.log(match);
      }, (err) => {
        console.log(err);
      })
      this.GetAllResources();
      this.SetLanguage();
      this.SetPlatform();
      if(this.config.get('isApp')) this.client = new WindowsAzure.MobileServiceClient("https://mobileappvocal.azurewebsites.net");
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

  init() {
    this.initService.init();
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  SubscribeHub() {
    this.talkService.LoadList().then(() => {
      this.hubService.Start(this.talkService.Talks.map((item) => {return item.Id;}));
    })

    this.hubService.hubProxy.on(HubMethod[HubMethod.Receive], (obj) => {
      console.log(obj);
      // if(obj.Message.User.Id != params.User.Id) {
      //   let mess = 'Nouveau message de ' + obj.Message.User.Username;
      //   this.showToast(mess);
      // }
      let mess = 'Nouveau message de ' + obj.Message.User.Username;
      this.showToast(mess);
      this.talkService.LoadList().then(() => {
        obj.Talk.DateLastMessage = obj.Message.SentTime;
        this.talkService.UpdateList(obj.Talk);
        this.talkService.SaveList();
      }).then(() => this.events.publish(HubMethod[HubMethod.Receive], obj));
    })
    
  }
}
