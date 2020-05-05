import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CaptionVocalPage } from '../caption-vocal/caption-vocal';

/**
 * Generated class for the RecordVocalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-record-vocal',
  templateUrl: 'record-vocal.html',
})
export class RecordVocalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordVocalPage');
  }

  goToCaptionVocal() {
    this.navCtrl.push(CaptionVocalPage);
  }

}
