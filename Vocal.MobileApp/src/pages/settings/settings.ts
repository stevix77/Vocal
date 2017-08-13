import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { params } from "../../services/params";
import { url } from "../../services/url";
import { AppUser } from "../../models/appUser";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { StoreService } from "../../services/storeService";
import { UserResponse } from '../../models/response/userResponse';
import { SettingsResponse } from '../../models/response/settingsResponse';
import { Response } from '../../models/response';
import { Request } from "../../models/request/Request";
import { SettingsChoices } from './settingsChoices/SettingsChoices';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.html",
  providers: [HttpService, CookieService]
})

export class SettingsPage implements OnInit {
  private model = {
    Settings: {} as SettingsResponse,
    ErrorSettings: ""
  }
  constructor(public navCtrl: NavController, private httpService: HttpService, private cookieService: CookieService, private storeService: StoreService) { 

  }

  ionViewDidLoad() {
    this.LoadSettings();
  }

  LoadSettings () {
    let obj = new Request();
    obj.Lang = params.Lang;
    let urlSettings = url.GetSettings();
    let cookie = this.cookieService.GetAuthorizeCookie(urlSettings, params.User)
    this.httpService.Post<Request>(urlSettings, obj, cookie).subscribe(
      resp => { 
        let response = resp.json() as Response<SettingsResponse>;
        if(!response.HasError) {
          this.model.Settings = response.Data;
        } else {
          
        }
      }
    );
  }

  SettingsChoices(choice: number, obj: any) {
   this.navCtrl.push(SettingsChoices, {UpdateType: choice, Obj: obj})
  }

  ngOnInit() {

  }
}
