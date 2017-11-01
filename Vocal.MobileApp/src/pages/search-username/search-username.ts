import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FriendsService } from '../../services/friendsService';
import { Response } from '../../models/response';
import { PeopleResponse } from "../../models/response/peopleResponse";

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
  providers: [FriendsService]
})
export class SearchUsernamePage {

  public model = {
    Friends: [] as Array<PeopleResponse>,
    ErrorFriends: ""
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private friendsService: FriendsService
    ) {
  }

  addFriend(id, index){
    let friends = [id];
    let indexItem = index;
    this.friendsService.add(friends).subscribe(
      resp => {
        let response = resp.json() as Response<boolean>;
        console.log(response);
        if(!response.HasError) {
          this.model.Friends[indexItem].IsFriend = true;
        } else {
          this.model.ErrorFriends = response.ErrorMessage;
        }
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchUsernamePage');
  }


  viewUsersByName(val) {
    if(val.length > 2) this.friendsService.search(val).subscribe(
      resp => { 
        let response = resp.json() as Response<Array<PeopleResponse>>;
        if(!response.HasError) {
          this.model.Friends = response.Data;
          console.log(this.model.Friends);
        } else {
          this.model.ErrorFriends = response.ErrorMessage;
        }
      }
    );
  }

}
