import { Component, OnInit } from "@angular/core";
import { NavParams, Events} from 'ionic-angular';
import { Response } from '../../../models/response';
import { params } from "../../../services/params";
import { url } from "../../../services/url";
import { UpdateRequest } from "../../../models/request/updateRequest";
import { HttpService } from "../../../services/httpService";
import { CookieService } from "../../../services/cookieService";
import { UpdateType } from "../../../models/enums";
import { SettingsService } from "../../../services/settingsService";

@Component({
  selector: "app-SettingsChoices",
  templateUrl: "./settingsChoices.html"
})

export class SettingsChoices implements OnInit {
  
  list: any;
  myItem: any;
  updateType: number;
  pageTitle: string;
  pageLabel: string;

  constructor(public navParams: NavParams, private httpService: HttpService, private cookieService: CookieService, private settingsService: SettingsService, private events: Events) { 
    this.list = this.navParams.get('Obj');
    this.updateType = this.navParams.get('UpdateType');
  }

  ItemSelected(choice) {
    for(let item of this.list) {
      if(item.Id == choice.Id) {
        item.IsChecked = true;
      }
      else
        item.IsChecked = false;
    }
  }

  ngOnInit() {

  }

  Initialize() {
    this.pageTitle = "Réglages";
    switch(this.updateType) {
      case UpdateType.Contact.valueOf():
        this.pageLabel = "Contact me";
        break;
      case UpdateType.Gender.valueOf():
        this.pageLabel = "Je suis";
        break;
      case UpdateType.Notification.valueOf():
        this.pageLabel = "Notifications";
        break;
      default:
        break;
    }
  }

  ionViewDidEnter() {
    this.Initialize();
    this.myItem = (this.list as Array<any>).find(x => x.IsChecked);
  }

  ionViewWillLeave() {
    let choice = (this.list as Array<any>).find(x => x.IsChecked);
    if(this.myItem == null || (choice != null && choice.Id != this.myItem.Id)) {
      let urlUpdate = url.UpdateUser();
      let obj: UpdateRequest = {
        Lang: params.Lang,
        UpdateType: this.updateType,
        Value: choice.Id
      };
      let cookie = this.cookieService.GetAuthorizeCookie(urlUpdate, params.User)
      this.httpService.Post<UpdateRequest>(urlUpdate, obj, cookie).subscribe(
        resp => { 
          let response = resp.json() as Response<Boolean>;
          if(!response.HasError) {
            this.settingsService.remove();
          } else {
            this.events.publish(response.ErrorMessage);
          }
        }
      );
    }
  }
}
