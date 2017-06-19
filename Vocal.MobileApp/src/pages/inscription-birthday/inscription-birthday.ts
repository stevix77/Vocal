import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionUsernamePage } from '../inscription-username/inscription-username'
import { DatePicker } from '@ionic-native/date-picker';

// class DatePickerMock extends DatePicker {
//   show() {
//     return new Promise((resolve, reject) => {
//       console.log('Show Date Picker');
//     })
//   }
// }


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
  providers: [ DatePicker ]
})
export class InscriptionBirthdayPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public datePicker: DatePicker) {
  }


  showDatePicker(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => console.log('Got date: ', date),
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  submit(){
    this.navCtrl.push(InscriptionUsernamePage);
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionBirthdayPage');
  }

}
