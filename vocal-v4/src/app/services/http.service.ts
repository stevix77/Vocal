import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  post<T>(url: string, obj: T, cookie?: any) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST',
    'Accept': 'application/json'});
    if(cookie != null)
      headers.set('Set-Cookie', cookie)
    return this.http.post(url, obj, { headers: headers });
  }

  get(url: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    'Accept': 'application/json' });
    return this.http.get(url, { headers: headers });
  }
}
