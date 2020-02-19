import { Component, OnInit } from "@angular/core";
import { NavController, AlertController } from 'ionic-angular';
import { params } from "../../services/params";
import { url } from "../../services/url";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { StoreService } from "../../services/storeService";
import { TalkService } from "../../services/talkService";
import { SettingsResponse } from '../../models/response/settingsResponse';
import { KeyStore } from '../../models/enums'; 
import { Response } from '../../models/response';
import { Request } from "../../models/request/request";
import { SettingsChoices } from './settingsChoices/settingsChoices';
import { SettingsBirthdayDate } from './settingsBirthdayDate/settingsBirthdayDate';
import { SettingsMail } from './settingsMail/settingsMail';
import { HomePage } from "../home/home";
import { FriendsService } from "../../services/friendsService";
import { SettingsService } from "../../services/settingsService";
import { FeedPage } from "../feed/feed";
import { Connexion } from "../connexion/connexion";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.html",
})

export class SettingsPage implements OnInit {
  private model = {
    Settings: {} as SettingsResponse,
    ErrorSettings: ""
  }
  constructor(public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    private httpService: HttpService, 
    private cookieService: CookieService, 
    private storeService: StoreService,
    private friendsService: FriendsService,
    private talkService: TalkService,
    private settingsService: SettingsService) { 

  }

  ionViewDidLoad() {
    
  }

  ionViewDidEnter() {
    this.settingsService.load().then(() => {
      if(this.settingsService.settings != null)
        this.model.Settings = this.settingsService.settings;
      else 
        this.LoadSettings();
    })
  }

  showConfirmLogout() {
    let confirm = this.alertCtrl.create({
      title: 'Êtes-vous sûr de vouloir déconnecter ?',
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Déconnexion',
          handler: () => {
            this.storeService.Clear();
            this.talkService.Clear();
            params.User = null;
            this.friendsService.clear();
            this.settingsService.clear();
            this.navCtrl.remove(0, this.navCtrl.length()).then(() => {             
              this.navCtrl.setRoot(Connexion);
            })
          }
        }
      ]
    });
    confirm.present();
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
          this.storeService.Set(KeyStore[KeyStore.Settings], this.model.Settings)
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

  SettingsBirthdayDate() {
    this.navCtrl.push(SettingsBirthdayDate, { BirthdayDate: this.model.Settings.BirthdayDate })
  }

  ngOnInit() {
    console.log("on init settings");
  }
}
