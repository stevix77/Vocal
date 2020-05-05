import { Component, OnInit } from "@angular/core";
import { NavParams, NavController, Events } from 'ionic-angular';
import { Response } from '../../../models/response';
import { SettingsService } from "../../../services/settingsService";
import { UpdateType } from "../../../models/enums";
import { UserService } from "../../../services/userService";

@Component({
  selector: "app-settingsMail",
  templateUrl: "./settingsMail.html"
})

export class SettingsMail implements OnInit {
  
  Email: string;
  PageTitle: string;
  PageLabel: string;
  constructor(private navCtrl: NavController, public navParams: NavParams,
              public events: Events, private userService: UserService, private settingsService: SettingsService) { 
    this.PageLabel = "Modifier mon adresse e-mail";
    this.PageTitle = "Réglages";
  }

  ionViewDidEnter() {
    this.Email = this.navParams.get('Email');
  }

  Submit() {
    this.userService.updateUser(UpdateType.Email, this.Email).subscribe(
      resp => { 
        let response = resp.json() as Response<Boolean>;
        if(!response.HasError) {
          this.settingsService.settings.Email = this.Email;
          this.settingsService.save();
          this.navCtrl.pop();
        } else {
          this.events.publish("Error", response.ErrorMessage); 
        }
      }
    );
  }

  ngOnInit() {

  }
}
