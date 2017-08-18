import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ViewController, ModalController } from 'ionic-angular';
import { params } from "../../services/params";
import { url } from "../../services/url";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { StoreService } from "../../services/storeService";
import { Request } from "../../models/request/Request";
import { NotificationRegisterRequest } from "../../models/request/notificationRegisterRequest";
import { InitResponse } from '../../models/response/InitResponse';
import { Response } from '../../models/response';
import { Push, PushObject } from '@ionic-native/push';
import { hubConnection  } from 'signalr-no-jquery';
import { ModalProfilePage } from '../../pages/modal-profile/modal-profile';
import {KeyStore} from '../../models/enums';
import {KeyValueResponse} from '../../models/response/keyValueResponse';
import { AudioRecorderComponent } from '../../components/audio-recorder/audio-recorder';

declare var WindowsAzure: any;

/**
 * Generated class for the VocalListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-vocal-list',
  templateUrl: 'vocal-list.html',
  providers: [HttpService, CookieService, Push, StoreService],
  entryComponents: [AudioRecorderComponent]
})
export class VocalListPage {
  notificationHub : any;
  isApp: boolean = !document.URL.startsWith('http');

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController, 
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public events: Events,
    private httpService: HttpService, 
    private cookieService: CookieService, 
    private storeService: StoreService,
    private push: Push) {

    const connection = hubConnection(url.BaseUri, null);
    const hubProxy = connection.createHubProxy('Vocal');
    console.log(hubProxy);
    connection.start()
    .done(function(){ 
      console.log('Now connected, connection ID=' + connection.id); 
      hubProxy.invoke('Connect', params.User.Id);
    })
    .fail(function(){ console.log('Could not connect'); });
    this.initPushNotification();

    events.subscribe('record:start', () => this.toggleHeader());
    events.subscribe('edit-vocal:close', () => this.toggleHeader());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VocalListPage');

    document.querySelector('[data-record]').addEventListener('touchstart', oEvt => this.events.publish('record:start'));
    if(this.isApp) document.querySelector('[data-record]').addEventListener('touchend', oEvt => this.events.publish('record:stop'));
  }

  ionViewWillEnter() {
    this.initialize();
  }

  toggleHeader() {
    document.querySelector('.ion-page ion-header').classList.toggle('anime-hide');
  }

  showProfile() {
    let profileModal = this.modalCtrl.create(ModalProfilePage);
    profileModal.present();
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  initialize() {
    let request = new Request();
    request.Lang = params.Lang;
    let urlInit = url.Init();
    let cookie = this.cookieService.GetAuthorizeCookie(urlInit, params.User)
    this.httpService.Post(urlInit, request, cookie).subscribe(
      resp => {
        let response = resp.json() as Response<InitResponse>;
        if(response.HasError)
          this.showAlert(response.ErrorMessage)
        else {
          let errorSettings = response.Data.Errors.find(x => x.Key == KeyStore.Settings.toString());
          let errorFriends = response.Data.Errors.find(x => x.Key == KeyStore.Friends.toString());
          let errorTalks = response.Data.Errors.find(x => x.Key == KeyStore.Talks.toString());
          this.SaveData(response.Data.Friends, errorFriends, KeyStore.Friends);
          this.SaveData(response.Data.Talks, errorTalks, KeyStore.Talks);
          this.SaveData(response.Data.Settings, errorSettings, KeyStore.Settings);
        }
      },
      error => this.showAlert(error)
    )
  }

  SaveData(data: any, error: KeyValueResponse<string, string>, key: KeyStore) {
    if(error == null)
      this.storeService.Set(key.toString(), data);
    else
      this.showAlert(error.Value);
  }

  initPushNotification() {
    var pushOptions = {
      notificationHubPath: 'vocal',
      connectionString: 'Endpoint=sb://mobileappvocal.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=veeFqIaZyw/bB4lcGMHHqnbT5hOkz5g4/KThwhFqCZY=',
      android: {
          senderID: '1054724390279'
      },
      ios: {
          alert: true,
          badge: true,
          sound: true
      },
      windows: {
      }
    };
    const pushObject: PushObject = this.push.init(pushOptions);
    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      let request = new NotificationRegisterRequest();
      request.Lang = params.Lang;
      request.UserId = params.User.Id;
      request.Channel = data.registrationId;
      request.Platform = params.Platform;
      let urlNotifRegister = url.NotificationRegister();
      let cookie = this.cookieService.GetAuthorizeCookie(urlNotifRegister, params.User)
      this.httpService.Post<NotificationRegisterRequest>(urlNotifRegister, request, cookie).subscribe(
          resp => {

        }
      )
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
  
}