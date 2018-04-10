import { TalkService } from './../../services/talkService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { MessageType } from '../../models/enums';
import { Response } from '../../models/response';
import { TalkResponse } from '../../models/response/talkResponse';
import { SendMessageResponse } from '../../models/response/sendMessageResponse';
import { AudioRecorder } from '../../services/audiorecorder';
import { ExceptionService } from "../../services/exceptionService";
import { FriendsService } from "../../services/friendsService";
import { MessageService } from "../../services/messageService";

/**
 * Generated class for the SendVocalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-send-vocal',
  templateUrl: 'send-vocal.html'
})
export class SendVocalPage {

  Friends: Array<any>;
  FileValue: string;
  Talks: Array<TalkResponse>;
  isSending: Boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public viewCtrl: ViewController,
              public events: Events, 
              private audioRecorder: AudioRecorder, 
              private talkService: TalkService,
              private friendsService: FriendsService,
              private exceptionService: ExceptionService,
              private messageService: MessageService) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad SendVocalPage');
    if(this.friendsService.Friends == null)
      this.friendsService.getList();
  }

  ionViewDidEnter() {
    this.getFriends();
  }

  getCheckedUsers() {
    let users = [];
    users = this.Friends.filter(x => x.Checked).map(x => x.Id)
    return users;
  }

  sendVocal() {
    try {
      if(!this.isSending) {
        this.isSending = true;
        this.audioRecorder.getFile().then(fileValue => {
          this.FileValue = fileValue;
          let users = this.getCheckedUsers();
          let duration = this.navParams.get('duration');
          this.messageService.sendMessage(null, MessageType.Vocal, users, duration, this.FileValue).subscribe(
            resp => {
              try {
                let response = resp.json() as Response<SendMessageResponse>;
                if(!response.HasError && response.Data.IsSent) {
                  console.log(response);
                  this.talkService.LoadList().then(() => {
                    this.talkService.UpdateList(response.Data.Talk);
                    this.talkService.SaveList();
                    this.navCtrl.remove(0,1).then(() => this.navCtrl.pop());
                  })
                }
                else {
                  console.log(response);
                  this.events.publish("Error", response.ErrorMessage);
                }
              } catch(err) {
                this.events.publish("Error", err.message);
                this.exceptionService.Add(err);
              }
              this.isSending = false;
            }
          )
        }).catch(err => {
          console.log(err);
          this.isSending = false;
          this.events.publish("Error", err.message);
          this.exceptionService.Add(err);
        });
      }
    } catch(err) {
      this.events.publish("Error", err.message);
      this.exceptionService.Add(err);
    }
  }

  getFriends() {
    this.Friends = this.friendsService.getFriends();
  }
}
