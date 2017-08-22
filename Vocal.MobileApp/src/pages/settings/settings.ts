import { Component, OnInit } from "@angular/core";
import { NavController } from 'ionic-angular';
import { params } from "../../services/params";
import { url } from "../../services/url";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { StoreService } from "../../services/storeService";
import { SettingsResponse } from '../../models/response/settingsResponse';
import { KeyStore } from '../../models/enums';
import { Response } from '../../models/response';
import { Request } from "../../models/request/Request";
import { SettingsChoices } from './settingsChoices/SettingsChoices';
import { SettingsMail } from './settingsMail/SettingsMail';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.html",
  providers: [HttpService, CookieService, StoreService]
})

export class SettingsPage implements OnInit {
  private model = {
    Settings: {} as SettingsResponse,
    ErrorSettings: ""
  }
  constructor(public navCtrl: NavController, private httpService: HttpService, private cookieService: CookieService, private storeService: StoreService) { 

  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    this.storeService.Get(KeyStore.Settings.toString()).then(
      store => {
        if(store != null)
          this.model.Settings = store;
        else
          this.LoadSettings();
      }
    )
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
          this.storeService.Set(KeyStore.Settings.toString(), this.model.Settings)
        } else {
          
        }
      }
    );
  }

  SettingsChoices(choice: number, obj: any) {
   this.navCtrl.push(SettingsChoices, {UpdateType: choice, Obj: obj})
  }

  SettingsMail() {
    this.navCtrl.push(SettingsMail, {Email: this.model.Settings.Email})
  }

  ngOnInit() {
    console.log("on init settings");
  }
}
