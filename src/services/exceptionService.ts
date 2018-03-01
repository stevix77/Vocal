import { Injectable } from "@angular/core";
import {HttpService} from "./httpService";
import {url} from "./url";

/**
 * @description
 * @class
 */
@Injectable()
export class ExceptionService {

  constructor(private httpService: HttpService) {
    
  }

  Add(error) {
    this.httpService.Post(url.AddException(), error, null).subscribe();
  }

}
