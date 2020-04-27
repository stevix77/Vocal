import { Injectable } from '@angular/core';
import { ExceptionService } from './exception.service';
import { HttpService } from './http.service';
// import { CookieService } from './cookie.service';
import { StoreService } from './store.service';
import { Request } from '../models/request/request';
import { params } from './params';
import { url } from './url';
import { LoginRequest } from '../models/request/loginRequest';
import { AppUser } from '../models/appUser';
// import { CryptService } from './crypt.service';
import { InitResponse } from '../models/response/InitResponse';
import { Response } from '../models/response';
import { KeyStore } from '../models/enums';
import { KeyValueResponse } from '../models/response/keyValueResponse';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  Errors: Array<string> = new Array();
  constructor(private storeService: StoreService, 
    // private cookieService: CookieService,
    private httpService: HttpService,
    private exceptionService: ExceptionService,
    // private cryptService: CryptService
    ) { }

  init() {
    try {
      let request = new Request();
      request.Lang = params.Lang;
      let urlInit = url.Init();
      // let cookie = this.cookieService.getAuthorizeCookie(urlInit, params.User)
      // return this.httpService.post(urlInit, request, cookie);
      return this.httpService.post(urlInit, request);
    } catch (error) {
      // this.events.publish("ErrorInit", error);
      this.exceptionService.add(error);
    }
  }

  connexion(username: string, password: string) {
    var obj = new LoginRequest(username, password);
    obj.Lang = params.Lang;
    let urlConnect = url.Login();
    return this.httpService.post<LoginRequest>(urlConnect, obj);
  }

  getAppUser(appUser, password) {
    let user = new AppUser();
    user.Email = appUser.Email;
    user.Id = appUser.Id;
    user.Firstname = appUser.Firstname;
    user.Lastname = appUser.Lastname;
    user.Username = appUser.Username;
    user.Pictures = appUser.Pictures;
    // user.Token = this.cryptService.generateToken(appUser.Username, password);
    this.storeService.set(KeyStore[KeyStore.User], user);
    return user;
  }

  manageData(response: Response<InitResponse>) {
    if(response.HasError) {
      this.Errors.push(response.ErrorMessage)
    }
    else {
      let errorSettings = response.Data.Errors.find(x => x.Key == KeyStore.Settings.toString());
      let errorFriends = response.Data.Errors.find(x => x.Key == KeyStore.Friends.toString());
      let errorTalks = response.Data.Errors.find(x => x.Key == KeyStore.Talks.toString());
      this.saveData(response.Data.Friends, errorFriends, KeyStore.Friends);
      this.saveData(response.Data.Talks, errorTalks, KeyStore.Talks);
      this.saveData(response.Data.Settings, errorSettings, KeyStore.Settings);
    }
  }

  saveData(data: any, error: KeyValueResponse<string, string>, key: KeyStore) {
    if(error == null) {
      this.storeService.set(KeyStore[key], data);
    }
    else {
      // this.events.publish("ErrorInit", error.Value);
    }
  }
}
