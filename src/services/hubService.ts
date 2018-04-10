import { Injectable } from "@angular/core";
import { hubConnection  } from 'signalr-no-jquery';
import { url } from "./url";
import { params } from "./params";
import {HubMethod} from '../models/enums';

@Injectable()
export class HubService {

  private connection: any;
  hubProxy: any;
  constructor() {
    this.connection = hubConnection(url.BaseUri, null);
    this.hubProxy = this.connection.createHubProxy('Vocal');
  }

  Start(talks: Array<string>) {
    this.connection.logging = true;
    this.connection.start()
    .done(() => { 
      console.log('Now connected, connection ID=' + this.connection.id); 
      this.hubProxy.invoke(HubMethod[HubMethod.Connect], params.User.Id);
      this.hubProxy.invoke(HubMethod[HubMethod.SubscribeToTalks], talks);
    })
    .fail(function(){ console.log('Could not connect'); });
  }

  Invoke(method: string, ...param: any[]) {
    switch(param.length) {
      case 0:
        this.hubProxy.invoke(method);
        break;
      case 1:
        this.hubProxy.invoke(method, param[0]);
        break;
      case 2:
        this.hubProxy.invoke(method, param[0], param[1]);
        break;
      case 3:
        this.hubProxy.invoke(method, param[0], param[1], param[2]);
        break;
      case 4:
        this.hubProxy.invoke(method, param[0], param[1], param[2], param[3]);
        break;
      case 5:
        this.hubProxy.invoke(method, param[0], param[1], param[2], param[3], param[4]);
        break;
      case 6:
        this.hubProxy.invoke(method, param[0], param[1], param[2], param[3], param[4], param[5]);
        break;
        
    }
  }

}
