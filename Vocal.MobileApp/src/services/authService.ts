import { Injectable } from "@angular/core";
import { url } from './url';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * @description
 * @class
 */
@Injectable()
export class AuthService {

  constructor(private http: Http) {
    
  }

  askPasswordForgot(obj: any) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var response = this.http.post(url.AskPwd(), obj, options);
    return response;
  }

}
