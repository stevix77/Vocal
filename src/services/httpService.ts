import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * @description
 * @class
 */
@Injectable()
export class HttpService {

  constructor(private http: Http) {
  }

  Post<T>(url: string, obj: T, cookie?: any) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    'Accept': 'application/json'});
    if(cookie != null)
      headers.set('Set-Cookie', cookie)
    let options = new RequestOptions({ headers: headers });
    var response = this.http.post(url, obj, options);
    return response;
  }

  Get(url: string) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var response = this.http.get(url, options);
    return response;
  }

}
