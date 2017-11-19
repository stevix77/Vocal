import { StoreService } from './storeService';
import { Injectable } from "@angular/core";
import { KeyStore } from "../models/enums";
import { KeyValueResponse } from "../models/response/KeyValueResponse";
import { Request } from "../models/request/Request";
import { params } from "./params";
import { url } from "./url";
import { CookieService } from "./cookieService";
import { HttpService } from "./httpService";
import { Response } from "../models/Response";
import { InitResponse } from "../models/response/InitResponse";
import { ExceptionService } from "./exceptionService";
import { Events } from "ionic-angular";

  
/**
 * @description
 * @class
 */
@Injectable()
export class InitService {

  Errors: Array<string> = new Array();

  constructor(private storeService: StoreService, 
              private cookieService: CookieService,
              private httpService: HttpService,
              private exceptionService: ExceptionService,
              private events: Events) {
    this.init();
  }

  init() {
    try {
      let request = new Request();
      request.Lang = params.Lang;
      let urlInit = url.Init();
      let cookie = this.cookieService.GetAuthorizeCookie(urlInit, params.User)
      this.httpService.Post(urlInit, request, cookie).subscribe(
        resp => {
          let response = resp.json() as Response<InitResponse>;
          if(response.HasError) {
            this.Errors.push(response.ErrorMessage)            
          }
          else {
            let errorSettings = response.Data.Errors.find(x => x.Key == KeyStore.Settings.toString());
            let errorFriends = response.Data.Errors.find(x => x.Key == KeyStore.Friends.toString());
            let errorTalks = response.Data.Errors.find(x => x.Key == KeyStore.Talks.toString());
            let errors = response.Data.Errors.find(x => x.Key == KeyStore.FriendsAddedMe.toString());
            this.saveData(response.Data.Friends, errorFriends, KeyStore.Friends);
            this.saveData(response.Data.Talks, errorTalks, KeyStore.Talks);
            this.saveData(response.Data.Settings, errorSettings, KeyStore.Settings);
            this.saveData(response.Data.FriendsAddedMe, errors, KeyStore.FriendsAddedMe);
          }
        },
        error => {
          this.events.publish("ErrorInit", error);
          this.exceptionService.Add(error);
        }
      )
    } catch (error) {
      this.events.publish("ErrorInit", error);
      this.exceptionService.Add(error);
    }
  }

  saveData(data: any, error: KeyValueResponse<string, string>, key: KeyStore) {
    if(error == null)
      this.storeService.Set(KeyStore[key], data);
    else
      this.events.publish("ErrorInit", error.Value);
  }
}
