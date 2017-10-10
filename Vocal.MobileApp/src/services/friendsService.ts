import { Injectable } from "@angular/core";
import { params } from './params';
import { url } from './url';
import { Response } from '../models/response';
import { HttpService } from './httpService';
import { CookieService } from './cookieService';
import { UserResponse } from '../models/response/userResponse';
import { ManageFriendsRequest } from "../models/request/manageFriendsRequest";

@Injectable()
export class FriendsService {
  public model = {
    Friends: [],
    ErrorFriends: ""
  }
  constructor(private httpService: HttpService, 
    private cookieService: CookieService
    ){

  }

  add(ids: Array<string>) {
    let obj = new ManageFriendsRequest();
    obj.Lang = params.Lang;
    obj.Ids = ids;
    obj.UserId = params.User.Id;
    let urlAddFriends = url.AddFriends();
    let cookie = this.cookieService.GetAuthorizeCookie(urlAddFriends, params.User)
    return this.httpService.Post<ManageFriendsRequest>(urlAddFriends, obj, cookie);
  }

  search(val) {
    let obj = {
      Lang: params.Lang,
      Keyword: val
    };
    let urlSearch = url.SearchPeople();
    let cookie = this.cookieService.GetAuthorizeCookie(urlSearch, params.User)
    return this.httpService.Post<any>(urlSearch, obj, cookie);
  }

  searchByMail(val) {
    let obj = {
      Lang: params.Lang,
      Keyword: val
    };
    let urlSearch = url.SearchPeopleByMail();
    let cookie = this.cookieService.GetAuthorizeCookie(urlSearch, params.User)
    return this.httpService.Post<any>(urlSearch, obj, cookie);
  }
}