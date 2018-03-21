import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Contacts } from '@ionic-native/contacts';
import { FriendsService } from '../../services/friendsService';
import { Response } from '../../models/response';
import { PeopleResponse } from "../../models/response/peopleResponse";

/**
 * Generated class for the ScanContactsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-scan-contacts',
  templateUrl: 'scan-contacts.html'
})
export class ScanContactsPage {

  Friends: Array<any>;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
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
          this.Friends[indexItem].IsFriend = true;
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
            if(!this.friendsService.Friends.some(x => item.emails.find(y => y.value == x.Email) != null)) {
              item.emails.forEach(elt => {
                listEmails.push(elt.value);
              });
            }
          }
        });

        this.friendsService.searchByMail(listEmails).subscribe(
          resp => { 
            let response = resp.json() as Response<Array<PeopleResponse>>;
            if(!response.HasError) {
              this.Friends = response.Data;
            } else {
              this.events.publish(response.ErrorMessage);
            }
          }
        );
      }
    }).catch((e) => this.events.publish(e))
  }

}
