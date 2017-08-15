import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  model = { Message: "" }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  sendMessage(){
    //Must be set in a template.html but sorry guys I don't know how to do that yet
    document.getElementById("message-room").innerHTML += "<ion-col class='col' col-6></ion-col><ion-col class='col' col-6><div class='msg msg-current-user'>" + this.model.Message + "</div></ion-col>";
    this.model.Message = "";
  }

}
