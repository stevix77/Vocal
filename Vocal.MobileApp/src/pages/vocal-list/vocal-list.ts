import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchFriendsRequest } from "../../models/request/searchFriendsRequest";
import { params } from "../../services/params";
import { url } from "../../services/url";
import { AppUser } from "../../models/appUser";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { StoreService } from "../../services/storeService";
import { AddFriendsRequest } from "../../models/request/addFriendsRequest";
import { NotificationRegisterRequest } from "../../models/request/notificationRegisterRequest";
import { UserResponse } from '../../models/response/userResponse';
import { Response } from '../../models/response';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { hubConnection  } from 'signalr-no-jquery';

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
  providers: [HttpService, CookieService, Push]
})
export class VocalListPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService, private cookieService: CookieService, private storeService: StoreService, private push: Push) {
    //this.searchFriends(['s.valentin77@gmail.com', 'tik@tik.fr']);
    //this.addFriends(["000000-f1e6-4c976-9a55-7525496145s", "599fc814-8733-4284-a606-de34c9845348"]);
    const connection = hubConnection(url.BaseUri, null);
    const hubProxy = connection.createHubProxy('Vocal');
    console.log(hubProxy);
    connection.start({ jsonp: true })
    .done(function(){ console.log('Now connected, connection ID=' + connection.id); })
    .fail(function(){ console.log('Could not connect'); });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VocalListPage');
  }

  initPushNotification() {
    var pushOptions = {
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
          let response = resp.json() as Response<string>;
        }
      )
    });
    
    // pushObject.on('notification').subscribe((data: any) => {
    //   console.log('message -> ' + data.message);
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
    // });

    pushObject.on('error').subscribe(error => {
      console.log('Error with Push plugin' + error);
    });
  }
  
}
