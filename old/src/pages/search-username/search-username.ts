import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FriendsService } from '../../services/friendsService';
import { Response } from '../../models/response';
import { PeopleResponse } from "../../models/response/peopleResponse";
import { ExceptionService } from "../../services/exceptionService";

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
  isReady: boolean = true;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    private friendsService: FriendsService,
    private exceptionService: ExceptionService
    ) {
  }

  addFriend(id, index){
    try {
      let friends = [id];
      let indexItem = index;
      this.friendsService.add(friends).subscribe(
        resp => {
          try {
            let response = resp.json() as Response<boolean>;
            if(!response.HasError) {
              let friend = this.Friends[indexItem];
              this.Friends.splice(indexItem, 1);
              this.friendsService.insertFriends(friend);
              this.friendsService.saveList();
            } else {
              this.events.publish("Error", response.ErrorMessage);
            }
          } catch (err) {
            this.exceptionService.Add(err);
            this.events.publish("Error", err.message);      
          }
        }
      );
    } catch(err) {
      this.exceptionService.Add(err);
      this.events.publish("Error", err.message);
    }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchUsernamePage');
  }


  viewUsersByName(val) {
    try {
      if(val.length > 2 && this.isReady) {
        this.isReady = false;
        this.friendsService.search(val).subscribe(
          resp => { 
            this.isReady = true;
            try {
              let response = resp.json() as Response<Array<PeopleResponse>>;
              if(!response.HasError) {
                this.Friends = response.Data;
              } else {
                this.events.publish("Error", response.ErrorMessage);
              }
            } catch(err) {
              this.events.publish("Error", err.message);
              this.exceptionService.Add(err);
            }
          }
        );
      }
    } catch(err) {
      this.events.publish("Error", err.message);
      this.exceptionService.Add(err);
    }
  }

}
