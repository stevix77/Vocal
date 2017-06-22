import { Injectable } from '@angular/core';
import {Cookie} from '../models/cookie';
import {AppUser} from '../models/appUser';
import hmacsha256 from 'crypto-js/hmac-sha256';


@Injectable()
export class CookieService {

    SetCookie(name: string, obj: any) {
        let value = JSON.stringify(obj);
        let dt = new Date(), expires = new Date()
        expires.setTime(dt.getTime() + (2 * 60 * 1000));
        document.cookie = name + "=" + value + ";expires=" + expires.toUTCString();
    }

    SetAuthorizeCookie(url: string, user: AppUser) {
        let cookie = new Cookie();
        cookie.UserId = user.Id;
        let timestamp = Math.round(new Date().getTime() / 1000).toString();
        let sign = url + "@" + timestamp + "@" + user.Token;
        cookie.Timestamp = timestamp;
        cookie.Sign = hmacsha256(sign);
        this.SetCookie("authorize", cookie);
    }
}