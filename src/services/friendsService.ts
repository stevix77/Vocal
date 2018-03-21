import { Injectable } from "@angular/core";
import { params } from './params';
import { url } from './url';
import { HttpService } from './httpService';
import { CookieService } from './cookieService';
import { ManageFriendsRequest } from "../models/request/manageFriendsRequest";
import { SearchFriendsRequest } from '../models/request/searchFriendsRequest';
import { StoreService } from "./storeService";
import { KeyStore } from "../models/enums";
import { UserResponse } from "../models/response/userResponse";
import { PeopleResponse } from "../models/response/peopleResponse";

@Injectable()
export class FriendsService {
  public Friends: Array<UserResponse>;

  constructor(private httpService: HttpService, 
    private cookieService: CookieService,
    private storeService: StoreService
    ){
      this.getList();
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

  insertFriends(friend: PeopleResponse) {
    this.Friends.push(friend);
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

  searchByMail(emails: Array<string>) {
    let obj = new SearchFriendsRequest();
    obj.Lang = params.Lang;
    obj.Emails = emails;
    let urlSearch = url.SearchContact();
    let cookie = this.cookieService.GetAuthorizeCookie(urlSearch, params.User)
    return this.httpService.Post<SearchFriendsRequest>(urlSearch, obj, cookie);
  }

  getList() {
    this.storeService.Get(KeyStore[KeyStore.Friends]).then(f => {
      if(f!= null &&  f.length > 0)
        this.Friends = f;
    })
  }

  saveList() {
    this.storeService.Set(KeyStore[KeyStore.Friends], this.Friends);
  }

  clear() {
    this.Friends = new Array();
  }

  // searchByMail(val) {
  //   let obj = {
  //     Lang: params.Lang,
  //     Keyword: val
  //   };
  //   let urlSearch = url.SearchPeopleByMail();
  //   let cookie = this.cookieService.GetAuthorizeCookie(urlSearch, params.User)
  //   return this.httpService.Post<any>(urlSearch, obj, cookie);
  // }
}