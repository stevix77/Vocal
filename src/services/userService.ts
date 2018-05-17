import { Injectable } from "@angular/core";
import { params } from './params';
import { url } from './url';
import { HttpService } from './httpService';
import { CookieService } from './cookieService';
import { UpdateRequest } from "../models/request/updateRequest";

@Injectable()
export class UserService {

  constructor(private httpService: HttpService, 
    private cookieService: CookieService
    ){
  }

  updateUser(type: number, value: any) {
    let urlUpdate = url.UpdateUser();
    let obj: UpdateRequest = {
      Lang: params.Lang,
      UpdateType: type,
      Value: value
    };
    let cookie = this.cookieService.GetAuthorizeCookie(urlUpdate, params.User);
    return this.httpService.Post<UpdateRequest>(urlUpdate, obj, cookie);
  }

}