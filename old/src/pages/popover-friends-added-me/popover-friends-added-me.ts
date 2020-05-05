import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FriendsService } from '../../services/friendsService';
import { Response } from '../../models/response';
import { PeopleResponse } from "../../models/response/peopleResponse";
import { StoreService } from "../../services/storeService";
import { KeyStore } from "../../models/enums";
import { ExceptionService } from "../../services/exceptionService";

/**
 * Generated class for the PopoverFriendsAddedMePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-friends-added-me',
  templateUrl: 'popover-friends-added-me.html'
})
export class PopoverFriendsAddedMePage {

  public friends: Array<PeopleResponse>;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public friendsService: FriendsService,
    public storeService: StoreService,
    private exceptionService: ExceptionService
    ) {
    this.friends = navParams.data.friends;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverFriendsAddedMePage');
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
              let friend = this.friends[indexItem];
              this.friends.splice(indexItem, 1);
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

  ionViewWillLeave() {
    this.storeService.Set(KeyStore[KeyStore.FriendsAddedMe], this.friends);
  }

}
