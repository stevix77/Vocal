import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  post<T>(url: string, obj: T, token?: string): Observable<Object> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST',
    'Accept': 'application/json'});
    if(token != null) {
      headers = headers.append("Authorization", "Bearer " + token);
    }
    return this.http.post(url, obj, { headers: headers });
  }

  get(url: string, token: string = null): Observable<Object> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    'Accept': 'application/json' });
    if(token != null) {
      headers = headers.append("Authorization", "Bearer " + token);
    }
    return this.http.get(url, { headers: headers });
  }
}
