import { Injectable } from "@angular/core";
import { url } from './url';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * @description
 * @class
 */
@Injectable()
export class UserService {

  constructor(private http: Http) {
  }

  IsExistsUsername(username: string, request: any) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var response = this.http.post(url.IsExistsUsername(username), request, options);
    return response;
  }

  IsExistsEmail(email: string, request: any) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var response = this.http.post(url.IsExistsEmail(email), request, options);
    return response;
  }

}
