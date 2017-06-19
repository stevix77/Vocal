import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionUsernamePage } from '../inscription-username/inscription-username'
// import { DatePicker } from '@ionic-native/date-picker';


/**
 * Generated class for the InscriptionBirthdayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inscription-birthday',
  templateUrl: 'inscription-birthday.html',
})
export class InscriptionBirthdayPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  init(){
    // date.show();
  }

  submit(){
    this.navCtrl.push(InscriptionUsernamePage);
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionBirthdayPage');
  }

}
