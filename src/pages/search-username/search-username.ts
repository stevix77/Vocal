import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
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
  templateUrl: 'search-username.html'
})
export class SearchUsernamePage {

  Friends: Array<PeopleResponse>;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    private friendsService: FriendsService
    ) {
  }

  addFriend(id, index){
    let friends = [id];
    let indexItem = index;
    this.friendsService.add(friends).subscribe(
      resp => {
        let response = resp.json() as Response<boolean>;
        if(!response.HasError) {
          let friend = this.Friends[indexItem];
          this.Friends.splice(indexItem, 1);
          this.friendsService.insertFriends(friend);
          this.friendsService.saveList();
        } else {
          this.events.publish("Error", response.ErrorMessage);
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
          this.Friends = response.Data;
          console.log(this.Friends);
        } else {
          this.events.publish("Error", response.ErrorMessage);
        }
      }
    );
  }

}
