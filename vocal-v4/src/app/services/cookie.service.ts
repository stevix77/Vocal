import { Injectable } from '@angular/core';
import { AppUser } from '../models/appUser';
import { Cookie } from '../models/cookie';
import { CryptService } from './crypt.service';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  // private cookieStorage = new CookieStorage();
  
  constructor(private cryptService: CryptService) { }

    setCookie(name: string, obj: any) {
        let value = JSON.stringify(obj);
        let dt = new Date(), expires = new Date()
        expires.setTime(dt.getTime() + (2 * 60 * 1000));
        document.cookie = name + "=" + value + ";expires=" + expires.toUTCString();
        // this.cookieStorage.setItem(name, value)
    }

    setAuthorizeCookie(url: string, user: AppUser) {
        let cookie = new Cookie();
        cookie.UserId = user.Id;
        let timestamp = Math.round(new Date().getTime() / 1000).toString();
        let sign = url + "@" + timestamp + "@" + user.Token;
        cookie.Timestamp = timestamp;
        cookie.Sign = this.cryptService.crypt(sign);
        this.setCookie("authorize", cookie);
    }

    getAuthorizeCookie(url: string, user: AppUser) : string {
        let cookie = new Cookie();
        cookie.UserId = user.Id;
        let timestamp = Math.round(new Date().getTime() / 1000).toString();
        let sign = url + "@" + timestamp + "@" + user.Token;
        cookie.Timestamp = timestamp;
        cookie.Sign = this.cryptService.crypt(sign);
        let json = JSON.stringify(cookie);
        let dt = new Date(), expires = new Date()
        expires.setTime(dt.getTime() + (2 * 60 * 1000));
        let value = "authorize=" + json;
        return value;
    }
}
