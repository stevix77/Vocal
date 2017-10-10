import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VocalListPage } from '../vocal-list/vocal-list';
import { Contacts } from '@ionic-native/contacts';
import { HttpService } from '../../services/httpService';
import { params } from '../../services/params';
import { SearchFriendsRequest } from '../../models/request/searchFriendsRequest';
import { UserResponse } from '../../models/response/userResponse';
import { Response } from '../../models/response';
import { url } from '../../services/url';
import { CookieService } from '../../services/cookieService';
import { StoreService } from '../../services/storeService';
import { FriendsService } from '../../services/friendsService';

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
  providers: [Contacts, HttpService, CookieService, FriendsService]
})
export class InscriptionFindFriendsPage {

  private model = {
    Friends: [],
    ErrorFriends: ""
  }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private contacts: Contacts, 
    private httpService: HttpService, 
    private cookieService: CookieService, 
    private storeService: StoreService,
    private friendsService: FriendsService
    ) {
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
    let cookie = this.cookieService.GetAuthorizeCookie(urlSearch, params.User)
    this.httpService.Post<SearchFriendsRequest>(urlSearch, obj, cookie).subscribe(
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

  addFriends(ids: Array<string>) {
    this.friendsService.add(ids);
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
}
