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
    this.connection.start()
    .done(() => { 
      console.log('Now connected, connection ID=' + this.connection.id); 
      this.hubProxy.invoke(HubMethod[HubMethod.Connect], params.User.Id);
      this.hubProxy.invoke(HubMethod[HubMethod.SubscribeToTalks], talks);
    })
    .fail(function(){ console.log('Could not connect'); });
  }

  Invoke(method: string, ...param: any[]) {
    this.hubProxy.invoke(method, param);
  }

}
