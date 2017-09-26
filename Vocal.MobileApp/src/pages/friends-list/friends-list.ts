import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserResponse } from "../../models/response/userResponse";
import { KeyStore } from "../../models/enums";
import { StoreService } from "../../services/storeService";
import { CookieService } from "../../services/cookieService";
import { HttpService } from "../../services/httpService";
import { GetFriendsRequest } from "../../models/request/getFriendsRequest";
import { params } from "../../services/params";
import { url } from "../../services/url";
import { Response } from '../../models/response';
import { ManageFriendsRequest } from "../../models/request/manageFriendsRequest";

/**
 * Generated class for the FriendsListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-friends-list',
  templateUrl: 'friends-list.html',
  providers: [HttpService, CookieService, StoreService]
})
export class FriendsListPage {
  Friends: Array<UserResponse>;
  constructor(public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public navParams: NavParams,
    private storeService: StoreService, 
    private httpService: HttpService, 
    private cookieService: CookieService) {
  }

  showConfirm(userId) {
    let confirm = this.alertCtrl.create({
      title: 'Supprimer un contact',
      message: 'Êtes-vous sûr de vouloir supprimer ce contact ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.deleteContact(userId);
          }
        }
      ]
    });
    confirm.present();
  }

  deleteContact(userId) {
    console.log('delete');
    let obj = new ManageFriendsRequest();
    obj.Lang = params.Lang;
    obj.UserId = params.User.Id;
    obj.Ids = [userId];
    let urlFriends = url.RemoveFriends();
    let cookie = this.cookieService.GetAuthorizeCookie(urlFriends, params.User)
    this.httpService.Post<ManageFriendsRequest>(urlFriends, obj, cookie).subscribe(
      resp => { 
        let response = resp.json() as Response<boolean>;
        if(!response.HasError) {
          let index = this.Friends.findIndex(x => x.Id == userId);
          this.Friends.splice(index, 1);
          this.storeService.Set(KeyStore.Friends.toString(), this.Friends)
        } else {
          console.log("error ->" + response.ErrorMessage);
        }
      }
    );
  }

  ionViewWillEnter() {
    this.storeService.Get(KeyStore.Friends.toString()).then(
      store => {
        if(store != null)
          this.Friends = store
        else
          this.LoadFriends();
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsListPage');
  }

  LoadFriends() {
    let obj = new GetFriendsRequest();
    obj.Lang = params.Lang;
    obj.UserId = params.User.Id;
    let urlFriends = url.GetFriends();
    let cookie = this.cookieService.GetAuthorizeCookie(urlFriends, params.User)
    this.httpService.Post<GetFriendsRequest>(urlFriends, obj, cookie).subscribe(
      resp => { 
        let response = resp.json() as Response<Array<UserResponse>>;
        if(!response.HasError) {
          this.Friends = response.Data;
          this.storeService.Set(KeyStore.Friends.toString(), this.Friends)
        } else {
          
        }
      }
    );
  }

}
