import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InscriptionBirthdayPage } from '../inscription-birthday/inscription-birthday';
import { StoreService } from '../../services/storeService';
import { params } from '../../services/params';
import { RegisterRequest } from '../../models/request/registerRequest';


@Component({
  selector: 'page-inscription',
  templateUrl: 'inscription.html'
})
export class Inscription {

  model = {
    Firstname: "",
    Lastname: "",
    ErrorFirstname: "",
    ErrorLastname: ""
  }
  

  ionViewDidEnter() {
    // this.storeService.Get("registerRequest").then(
    //   request => {
    //     if(request != null) {
    //       this.model.Firstname = request.Firstname;
    //       this.model.Lastname = request.Lastname;
    //     }
    //   }
    // )
  }

  constructor(public navCtrl: NavController, private storeService: StoreService) {
  }

  submit() {
    if(this.model.Firstname !== "" && this.model.Lastname != "") {
      let registerObj = new RegisterRequest();
      registerObj.Lang = params.Lang;
      registerObj.Firstname = this.model.Firstname;
      registerObj.Lastname = this.model.Lastname;
      this.storeService.Set("registerRequest", registerObj);
      this.navCtrl.push(InscriptionBirthdayPage,{'registerRequest': registerObj} );
    } else {
      this.model.ErrorFirstname = this.model.Firstname == "" ? params.Resources.find(x => x.Key == "FirstnameEmpty").Value : "";
      this.model.ErrorLastname = this.model.Lastname == "" ? params.Resources.find(x => x.Key == "LastnameEmpty").Value : "";
    }
  }

}
