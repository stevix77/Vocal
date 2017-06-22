import { Injectable } from "@angular/core";
import { url } from './url';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * @description
 * @class
 */
@Injectable()
export class ResourceService {

  constructor(private http: Http) {
  }

  GetListResources(lang: string) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var response = this.http.post(url.GetListResources(lang), null, options);
    return response;
  }

}
