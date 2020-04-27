import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: Http) { }

  post<T>(url: string, obj: T, cookie?: any) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    'Accept': 'application/json'});
    if(cookie != null)
      headers.set('Set-Cookie', cookie)
    let options = new RequestOptions({ headers: headers });
    var response = this.http.post(url, obj, options);
    return response;
  }

  get(url: string) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var response = this.http.get(url, options);
    return response;
  }
}
