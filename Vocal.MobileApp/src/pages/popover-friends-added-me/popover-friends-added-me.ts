import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FriendsService } from '../../services/friendsService';
import { Response } from '../../models/response';
import { UserResponse } from '../../models/response/userResponse';

/**
 * Generated class for the PopoverFriendsAddedMePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-friends-added-me',
  templateUrl: 'popover-friends-added-me.html',
  providers: [FriendsService]
})
export class PopoverFriendsAddedMePage {

  public friends: Array<any>;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public friendsService: FriendsService
    ) {
    this.friends = navParams.data.friends;
    console.log(this.friends);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverFriendsAddedMePage');
  }

  addFriend(id, index){
    let friends = [id];
    let indexItem = index;
    this.friendsService.add(friends).subscribe(
      resp => {
        let response = resp.json() as Response<boolean>;
        console.log(response);
        if(!response.HasError) {
          this.friends[indexItem].IsFriend = true;
        } else {
          //this.model.ErrorFriends = response.ErrorMessage;
        }
      }
    );
  }

}
