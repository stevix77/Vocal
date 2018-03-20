import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Response } from '../../models/response';
import { UserResponse } from '../../models/response/userResponse';
import { FriendsService } from '../../services/friendsService';

/**
 * Generated class for the SearchMailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search-mail',
  templateUrl: 'search-mail.html'
})
export class SearchMailPage {

  public model = {
    Friends: [],
    ErrorFriends: ""
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private friendsService: FriendsService, 
    ) {
  }

  viewUsersByMail(mail) {
    this.friendsService.searchByMail(mail).subscribe(
      resp => { 
        let response = resp.json() as Response<Array<UserResponse>>;
        console.log(response);
        if(!response.HasError) {
          this.model.Friends = response.Data;
        } else {
          this.model.ErrorFriends = response.ErrorMessage;
        }
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchMailPage');
  }

}
