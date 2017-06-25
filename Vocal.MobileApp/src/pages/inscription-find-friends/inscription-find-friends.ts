import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VocalListPage } from '../vocal-list/vocal-list';
import { Connexion } from '../connexion/connexion';
import { Contacts } from '@ionic-native/contacts';
import { HttpService } from '../../services/httpService';
import { params } from '../../services/params';
import { SearchFriendsRequest } from '../../models/request/searchFriendsRequest';
import { UserResponse } from '../../models/response/userResponse';
import { Response } from '../../models/response';
import {AddFriendsRequest} from '../../models/request/addFriendsRequest';
import {url} from '../../services/url';
import {CookieService} from '../../services/cookieService';
import {AppUser} from '../../models/appUser'
import {StoreService} from '../../services/storeService'

/**
 * Generated class for the InscriptionFindFriendsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inscription-find-friends',
  templateUrl: 'inscription-find-friends.html',
  providers: [Contacts, HttpService, CookieService]
})
export class InscriptionFindFriendsPage {

  private model = {
    Friends: [],
    ErrorFriends: ""
  }
  private User: AppUser;
  constructor(public navCtrl: NavController, public navParams: NavParams, private contacts: Contacts, private httpService: HttpService, private cookieService: CookieService, private storeService: StoreService) {
    this.storeService.Get("user").then(
      user => {
        if(user != null)
          this.User = user;
        else
          this.navCtrl.push(Connexion)
      }
    ).catch(error => {
      console.log(error);
      this.navCtrl.push(Connexion)
    });
  }

  getAccess(){
    console.log('popin autorisation accès contacts');
    this.navCtrl.push(VocalListPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionFindFriendsPage');
  }
  
  searchFriends(emails: Array<string>) {
    let obj = new SearchFriendsRequest();
    obj.Lang = params.Lang;
    obj.Emails = emails;
    let urlSearch = url.SearchFriends();
    this.cookieService.SetAuthorizeCookie(urlSearch, this.User)
    this.httpService.Post<SearchFriendsRequest>(urlSearch, obj).subscribe(
      resp => {
        let response = resp.json() as Response<Array<UserResponse>>;
        if(!response.HasError) {
          this.model.Friends = response.Data;
        } else {
          this.model.ErrorFriends = response.ErrorMessage;
        }
      }
    );
  }

  getFriends() {
    this.contacts.find(["*"]).then(c => {
      if(c.length > 0) {
        let listEmails: Array<string> = [];
        c.forEach(item => {
          item.emails.forEach(elt => {
            listEmails.push(elt.value);
          })
        });
        this.searchFriends(listEmails);
      }
    }).catch((e) => this.model.ErrorFriends = "")
  }

  addFriends(ids: Array<string>) {
    let obj = new AddFriendsRequest();
    obj.Lang = params.Lang;
    obj.Ids = ids;
    let urlAddFriends = url.AddFriends();
    this.cookieService.SetAuthorizeCookie(urlAddFriends, this.User)
    this.httpService.Post<AddFriendsRequest>(urlAddFriends, obj).subscribe(
      resp => {
        let response = resp.json() as Response<boolean>;
        if(!response.HasError) {
          
        } else {
          this.model.ErrorFriends = response.ErrorMessage;
        }
      }
    );
  }

}
