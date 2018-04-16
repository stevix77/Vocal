import { Component, OnInit } from "@angular/core";
import { NavParams, NavController, Events } from "ionic-angular";
import { UpdateType } from "../../../models/enums";
import { UserService } from "../../../services/userService";
import { Response } from '../../../models/response';
import { SettingsService } from "../../../services/settingsService";

@Component({
  selector: "app-settingsBirthdayDate",
  templateUrl: "./settingsBirthdayDate.html"
})

export class SettingsBirthdayDate implements OnInit {
  
  model = {
    BirthdayDate: new Date(),
    BirthdayDateString: "",
    ErrorBirthdayDate: ""
  }
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public events: Events,
              private userService: UserService,
              private settingsService: SettingsService) { 
    this.model.BirthdayDate = this.navParams.get('BirthdayDate');
    this.model.BirthdayDateString = this.navParams.get('BirthdayDate');
  }

  ngOnInit() {

  }

  submit(form) {
    this.model.BirthdayDate = new Date(this.model.BirthdayDateString);
    this.userService.updateUser(UpdateType.BirthdayDate, this.model.BirthdayDate).subscribe(
      resp => {
        let response = resp.json() as Response<Boolean>;
        if(!response.HasError) {
          this.settingsService.settings.BirthdayDate = this.model.BirthdayDate;
          this.settingsService.save();
          this.navCtrl.pop();
        } else {
          this.events.publish("Error", response.ErrorMessage);
        }
      }
    )
  }
}
