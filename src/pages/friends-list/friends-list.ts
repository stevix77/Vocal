import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { UserResponse } from "../../models/response/userResponse";
import { PictureType } from "../../models/enums";
import { Response } from '../../models/response';
import { MessagePage } from "../message/message";
import { PictureResponse } from "../../models/response/pictureResponse";
import { FriendsService } from "../../services/friendsService";
import { ExceptionService } from "../../services/exceptionService";

/**
 * Generated class for the FriendsListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-friends-list',
  templateUrl: 'friends-list.html'
})
export class FriendsListPage {
  Friends: Array<UserResponse>;
  constructor(public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public events: Events,
    public navParams: NavParams, 
    private friendsService: FriendsService,
    private exceptionService: ExceptionService) {
  }

  deleteContact(userId) {
    try {
      this.friendsService.delete([userId]).subscribe(
        resp => { 
          try {
            let response = resp.json() as Response<boolean>;
            if(!response.HasError) {
              this.friendsService.remove([userId]);
            } else {
              this.events.publish("Error", response.ErrorMessage);
            }
          } catch(err) {
            this.events.publish("Error", err.message);    
          }
        }
      );
    } catch (err) {
      this.exceptionService.Add(err);
      this.events.publish("Error", err.message);
    }
  }

  ionViewWillEnter() {
    this.Friends = this.friendsService.getFriends();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsListPage');
  }

  getPicture(pictures: Array<PictureResponse>) {
    return pictures.find(x => x.Type == PictureType.Talk).Value;
  }

  sendMessage(userId) {
    this.navCtrl.push(MessagePage, {TalkId: null, UserId: userId})
  }

  showConfirm(userId) {
    let confirm = this.alertCtrl.create({
      title: 'Supprimer un contact',
      message: 'Êtes-vous sûr de vouloir supprimer ce contact ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.deleteContact(userId);
          }
        }
      ]
    });
    confirm.present();
  }

}
