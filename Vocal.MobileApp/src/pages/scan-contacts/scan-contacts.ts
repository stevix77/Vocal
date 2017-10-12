import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contacts } from '@ionic-native/contacts';
import { FriendsService } from '../../services/friendsService';
import { Response } from '../../models/response';
import { UserResponse } from '../../models/response/userResponse';

/**
 * Generated class for the ScanContactsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-scan-contacts',
  templateUrl: 'scan-contacts.html',
  providers: [Contacts, FriendsService]
})
export class ScanContactsPage {

  private model = {
    Friends: [],
    ErrorFriends: ""
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private contacts: Contacts,
    private friendsService: FriendsService
    ) {
    this.getFriends();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanContactsPage');
  }


  addFriend(id, index){
    let friends = [id];
    let indexItem = index;
    this.friendsService.add(friends).subscribe(
      resp => {
        let response = resp.json() as Response<boolean>;
        if(!response.HasError) {
          this.model.Friends[indexItem].IsFriend = true;
        } else {
          //this.model.ErrorFriends = response.ErrorMessage;
        }
      }
    );
  }

  getFriends() {
    this.contacts.find(["*"]).then(c => {
      if(c.length > 0) {
        let listEmails: Array<string> = [];
        c.forEach(item => {
          if(item.emails !== null) {
            if(!this.friendsService.model.Friends.some(x => item.emails.find(y => y.value == x.Email) != null)) {
              item.emails.forEach(elt => {
                listEmails.push(elt.value);
              });
            }
          }
        });

        this.friendsService.searchByMail(listEmails).subscribe(
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
    }).catch((e) => this.model.ErrorFriends = "")
  }

}
