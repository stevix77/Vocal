import { Component, Input } from '@angular/core';
import { File } from '@ionic-native/file';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SelectFriendsComponent } from '../../components/select-friends/select-friends';
import { VocalListPage } from '../../pages/vocal-list/vocal-list';
import { StoreService } from "../../services/storeService";
import { KeyStore } from '../../models/enums';

/**
 * Generated class for the SendVocalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-send-vocal',
  templateUrl: 'send-vocal.html',
  entryComponents: [SelectFriendsComponent],
  providers: [StoreService]
})
export class SendVocalPage {

  Friends: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storeService: StoreService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendVocalPage');
    this.GetFriends();
  }

  goToVocalList() {
    let users = [];
    this.Friends.forEach(elt => {
      if(elt.Checked)
        users.push(elt);
    });
    this.navCtrl.push(VocalListPage);
  }

  GetFriends() {
    this.storeService.Get(KeyStore.Friends.toString()).then(
      friends => {
        this.Friends = friends;
      }
    ).catch(error => {
      console.log(error);
      
    });
  }

}
