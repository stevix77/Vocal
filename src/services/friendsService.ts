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
import { GetFriendsRequest } from "../models/request/getFriendsRequest";
import { Response } from '../models/response';
import { ExceptionService } from "./exceptionService";
import { Events } from "ionic-angular";
import { Request } from "../models/request/request";

@Injectable()
export class FriendsService {
  public Friends: Array<UserResponse> = [];

  constructor(private httpService: HttpService, 
    private events: Events,
    private cookieService: CookieService,
    private exceptionService: ExceptionService,
    private storeService: StoreService
    ){
      this.getList();
  }

  getFriends() {
    return this.Friends;
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

  delete(ids: Array<string>) {
    let obj = new ManageFriendsRequest();
    obj.Lang = params.Lang;
    obj.UserId = params.User.Id;
    obj.Ids = ids;
    let urlFriends = url.RemoveFriends();
    let cookie = this.cookieService.GetAuthorizeCookie(urlFriends, params.User)
    return this.httpService.Post<ManageFriendsRequest>(urlFriends, obj, cookie);
  }

  insertFriends(friend: PeopleResponse) {
    this.Friends.push(friend);
    this.sortList();
    this.saveList();
  }

  sortList() {
    let lst = this.Friends.sort(function(a,b) {
      if(a.Username < b.Username)
        return -1;
      if(a.Username > b.Username)
        return 1;
      return 0;
    });
    this.Friends = lst;
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
      else
        this.loadFriends();
    })
  }

  getFriendById(userId: string) {
    return this.Friends.find(x => x.Id == userId);
  }

  saveList() {
    this.storeService.Set(KeyStore[KeyStore.Friends], this.Friends);
  }

  clear() {
    this.Friends = new Array();
  }

  loadFriends() {
    try {
      let obj = new GetFriendsRequest();
      obj.Lang = params.Lang;
      obj.UserId = params.User.Id;
      let urlFriends = url.GetFriends();
      let cookie = this.cookieService.GetAuthorizeCookie(urlFriends, params.User)
      this.httpService.Post<GetFriendsRequest>(urlFriends, obj, cookie).subscribe(
        resp => { 
          try {
            let response = resp.json() as Response<Array<PeopleResponse>>;
            if(!response.HasError) {
              this.Friends = response.Data;
              this.storeService.Set(KeyStore[KeyStore.Friends], response.Data);
            } else {
              this.events.publish("Error", response.ErrorMessage);
            }
          } catch(err) {
            this.exceptionService.Add(err);
          }
        }
      );
    } catch(err) {
      this.exceptionService.Add(err);
    }
  }

  remove(ids: Array<string>) {
    ids.forEach(element => {
      let index = this.Friends.findIndex(x => x.Id == element);
      this.Friends.splice(index, 1);
    });
    this.saveList();
  }

  getContactAddedMe() {
    let urlServ = url.GetContactAddedMe();
    let obj: Request = {
      Lang: params.Lang
    };
    let cookie = this.cookieService.GetAuthorizeCookie(urlServ, params.User);
    return this.httpService.Post<Request>(urlServ, obj, cookie);
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