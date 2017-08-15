import { Component, OnInit } from "@angular/core";
import { NavParams, NavController} from 'ionic-angular';
import { Response } from '../../../models/response';
import { params } from "../../../services/params";
import { url } from "../../../services/url";
import { SettingsResponse } from '../../../models/response/settingsResponse';
import { UpdateRequest } from "../../../models/request/updateRequest";
import { HttpService } from "../../../services/httpService";
import { CookieService } from "../../../services/cookieService";
import { StoreService } from "../../../services/storeService";
import { UpdateType } from "../../../models/enums";
import { KeyStore } from '../../../models/enums';

@Component({
  selector: "app-settingsMail",
  templateUrl: "./settingsMail.html",
  providers: [HttpService, CookieService]
})

export class SettingsMail implements OnInit {
  
  Email: string;
  PageTitle: string;
  PageLabel: string;
  settingsStore: SettingsResponse;
  constructor(private navCtrl: NavController, public navParams: NavParams, private httpService: HttpService, private cookieService: CookieService, private storeService: StoreService) { 
    this.PageLabel = "Modifier mon adresse e-mail";
    this.PageTitle = "Réglages";
  }

  ionViewDidEnter() {
    this.Email = this.navParams.get('Email');
    this.storeService.Get(KeyStore.Settings.toString()).then(
      store => {
        this.settingsStore = store;
      }
    )
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
          this.settingsStore.Email = this.Email;
          this.storeService.Set(KeyStore.Settings.toString(), this.settingsStore)
          this.navCtrl.pop();
        } else {
          
        }
      }
    );
  }

  ngOnInit() {

  }
}
