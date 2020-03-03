import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SendVocalPage } from '../send-vocal/send-vocal';

/**
 * Generated class for the CaptionVocalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-caption-vocal',
  templateUrl: 'caption-vocal.html',
})
export class CaptionVocalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaptionVocalPage');
  }

  goToSendVocal(){
    this.navCtrl.push(SendVocalPage);
  }

}
