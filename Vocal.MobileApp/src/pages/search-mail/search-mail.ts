import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchFriendsRequest } from '../../models/request/searchFriendsRequest';
import { params } from '../../services/params';
import { url } from '../../services/url';
import { Response } from '../../models/response';
import { HttpService } from '../../services/httpService';
import { CookieService } from '../../services/cookieService';
import { UserResponse } from '../../models/response/userResponse';

/**
 * Generated class for the SearchMailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search-mail',
  templateUrl: 'search-mail.html',
  providers: [HttpService, CookieService]
})
export class SearchMailPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private cookieService: CookieService, 
    private httpService: HttpService) {
  }

  viewUsersByMail(val) {
    let emails = [val];
    this.searchFriends(emails);
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
        console.log(response);
        // if(!response.HasError) {
        //   this.model.Friends = response.Data;
        // } else {
        //   this.model.ErrorFriends = response.ErrorMessage;
        // }
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchMailPage');
  }

}
