import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Contacts } from '@ionic-native/contacts';
import { FriendsService } from '../../services/friendsService';
import { Response } from '../../models/response';
import { PeopleResponse } from "../../models/response/peopleResponse";
import { ExceptionService } from "../../services/exceptionService";

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
    private friendsService: FriendsService,
    private exceptionService: ExceptionService
    ) {
    this.getFriends();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanContactsPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ScanContactsPage');
    if(this.friendsService.Friends == null)
      this.friendsService.getList();
  }

  addFriend(id, index){
    try {
      let friends = [id];
      this.friendsService.add(friends).subscribe(
        resp => {
          try {
            let response = resp.json() as Response<boolean>;
            if(!response.HasError) {
              this.Friends[index].IsFriend = true;
              this.friendsService.insertFriends(this.Friends[index])
            } else {
              this.events.publish("Error", response.ErrorMessage);
            }
          } catch(err) {
            this.events.publish("Error", err.message)
            this.exceptionService.Add(err);      
          }
        }
      );
    } catch(err) {
      this.events.publish("Error", err.message)
      this.exceptionService.Add(err);
    }
  }

  getFriends() {
    try {
      this.contacts.find(["*"]).then(c => {
        if(c.length > 0) {
          let listEmails: Array<string> = [];
          c.forEach(item => {
            if(item.emails !== null) {
              if(!this.friendsService.getFriends().some(x => item.emails.find(y => y.value == x.Email) != null)) {
                item.emails.forEach(elt => {
                  listEmails.push(elt.value);
                });
              }
            }
          });
          this.searchFriendsByEmail(listEmails);
        }
      }).catch((e) => {
        this.events.publish("Error", e.message)
        this.exceptionService.Add(e);
      });
    } catch(err) {
      this.events.publish("Error", err.message)
      this.exceptionService.Add(err);
    }
  }

  searchFriendsByEmail(listEmails: Array<string>) {
    this.friendsService.searchByMail(listEmails).subscribe(
      resp => { 
        try {
          let response = resp.json() as Response<Array<PeopleResponse>>;
          if(!response.HasError) {
            this.Friends = response.Data;
          } else {
            this.events.publish("Error", response.ErrorMessage);
          }
        } catch(err) {
          this.events.publish("Error", err.message)
          this.exceptionService.Add(err);
        }
      }
    );
  }

}
