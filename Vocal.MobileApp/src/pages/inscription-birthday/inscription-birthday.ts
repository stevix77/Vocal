import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionUsernamePage } from '../inscription-username/inscription-username'
import { StoreService } from '../../services/storeService';
import { RegisterRequest } from '../../models/request/registerRequest';
import { ResourceResponse } from '../../models/response/ResourceResponse';
// import { DatePicker } from '@ionic-native/date-picker';
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

  model = {
    BirthdayDate: new Date(),
    BirthdayDateString: "",
    ErrorBirthdayDate: ""
  }
  registerRequest: RegisterRequest;
  resources: Array<ResourceResponse>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public datePicker: DatePicker, private storeService: StoreService) {
    this.storeService.Get('resource').then(
      r => {
        if(r != null) {
          this.resources = r;
        }
      }
    )
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
    this.model.BirthdayDate = new Date(this.model.BirthdayDateString)
    this.registerRequest = this.navParams.get('registerRequest');
    this.registerRequest.BirthdayDate = this.model.BirthdayDate;
    this.navCtrl.push(InscriptionUsernamePage, {'registerRequest': this.registerRequest});
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionBirthdayPage');
  }

}
