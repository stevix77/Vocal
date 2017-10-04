import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    this.searchFriends(val);
  }

  searchFriends(val) {
    let obj = {
      Lang: params.Lang,
      Keyword: val
    };
    let urlSearch = url.SearchPeople();
    this.httpService.Post<any>(urlSearch, obj).subscribe(
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
