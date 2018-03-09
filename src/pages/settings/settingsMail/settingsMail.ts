import { Component, OnInit } from "@angular/core";
import { NavParams, NavController} from 'ionic-angular';
import { Response } from '../../../models/response';
import { params } from "../../../services/params";
import { url } from "../../../services/url";
import { UpdateRequest } from "../../../models/request/updateRequest";
import { HttpService } from "../../../services/httpService";
import { CookieService } from "../../../services/cookieService";
import { SettingsService } from "../../../services/settingsService";
import { UpdateType } from "../../../models/enums";

@Component({
  selector: "app-settingsMail",
  templateUrl: "./settingsMail.html"
})

export class SettingsMail implements OnInit {
  
  Email: string;
  PageTitle: string;
  PageLabel: string;
  constructor(private navCtrl: NavController, public navParams: NavParams, private httpService: HttpService, private cookieService: CookieService, private settingsService: SettingsService) { 
    this.PageLabel = "Modifier mon adresse e-mail";
    this.PageTitle = "Réglages";
  }

  ionViewDidEnter() {
    this.Email = this.navParams.get('Email');
  }

  Submit() {
    let urlUpdate = url.UpdateUser();
    let obj: UpdateRequest = {
      Lang: params.Lang,
      UpdateType: UpdateType.Email,
      Value: this.Email
    };
    let cookie = this.cookieService.GetAuthorizeCookie(urlUpdate, params.User)
    this.httpService.Post<UpdateRequest>(urlUpdate, obj, cookie).subscribe(
      resp => { 
        let response = resp.json() as Response<Boolean>;
        if(!response.HasError) {
          this.settingsService.settings.Email = this.Email;
          this.settingsService.save();
          this.navCtrl.pop();
        } else {
          
        }
      }
    );
  }

  ngOnInit() {

  }
}
