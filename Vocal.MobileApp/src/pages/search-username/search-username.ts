import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { params } from '../../services/params';
import { url } from '../../services/url';
import { Response } from '../../models/response';
import { HttpService } from '../../services/httpService';
import { CookieService } from '../../services/cookieService';
import { UserResponse } from '../../models/response/userResponse';
import { ManageFriendsRequest } from "../../models/request/manageFriendsRequest";

/**
 * Generated class for the SearchUsernamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search-username',
  templateUrl: 'search-username.html',
  providers: [HttpService, CookieService]
})
export class SearchUsernamePage {
  public model = {
    Friends: [],
    ErrorFriends: ""
  }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private cookieService: CookieService, 
    private httpService: HttpService) {
  }

  addFriend(id){
    let friends = [id];
    this.addFriends(friends);
  }

  addFriends(ids: Array<string>) {

    let obj = new ManageFriendsRequest();
    obj.Lang = params.Lang;
    obj.Ids = ids;
    obj.UserId = params.User.Id;
    let urlAddFriends = url.AddFriends();
    let cookie = this.cookieService.GetAuthorizeCookie(urlAddFriends, params.User)
    this.httpService.Post<ManageFriendsRequest>(urlAddFriends, obj, cookie).subscribe(
      resp => {
        let response = resp.json() as Response<boolean>;
        console.log(response);
        if(!response.HasError) {
          
        } else {
          this.model.ErrorFriends = response.ErrorMessage;
        }
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchUsernamePage');
  }

  searchFriends(val) {
    let obj = {
      Lang: params.Lang,
      Keyword: val
    };
    let urlSearch = url.SearchPeople();
    let cookie = this.cookieService.GetAuthorizeCookie(urlSearch, params.User)
    this.httpService.Post<any>(urlSearch, obj, cookie).subscribe(
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

  viewUsersByName(val) {
    if(val.length > 2) this.searchFriends(val);
  }

}
