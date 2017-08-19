import { Injectable } from "@angular/core";
import { hubConnection  } from 'signalr-no-jquery';
import { url } from "./url";
import { params } from "./params";

@Injectable()
export class HubService {

  static connection: any;
  static hubProxy: any;
  constructor() {
    HubService.connection = hubConnection(url.BaseUri, null);
    HubService.hubProxy = HubService.connection.createHubProxy('Vocal');
  }

  Start() {
    HubService.connection.start()
    .done(function(){ 
      console.log('Now connected, connection ID=' + HubService.connection.id); 
      HubService.hubProxy.invoke('Connect', params.User.Id);
    })
    .fail(function(){ console.log('Could not connect'); });
  }

}
