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

  Post<T>(url: string, obj: T) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var response = this.http.post(url, obj, options);
    return response;
  }

  Get(url: string) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var response = this.http.get(url, options);
    return response;
  }

}
