import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { url } from './url';

@Injectable({
  providedIn: 'root'
})
export class ExceptionService {

  constructor(private httpService: HttpService) { }

  add(error) {
    this.httpService.post(url.AddException(), JSON.stringify(error), null).subscribe();
  }
}
