import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  post<T>(url: string, obj: T) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST',
    'Accept': 'application/json'});
    return this.http.post(url, obj, { headers: headers });
  }

  get(url: string, token: string = null) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    'Accept': 'application/json' });
    if(token != null) {
      headers.append("Authorization", "Bearer " + token);
    }
    return this.http.get(url, { headers: headers });
  }
}
