import { Injectable } from "@angular/core";
import { hubConnection  } from 'signalr-no-jquery';
import { url } from "./url";
import { params } from "./params";

@Injectable()
export class HubService {

  private connection: any;
  hubProxy: any;
  constructor() {
    this.connection = hubConnection(url.BaseUri, null);
    this.hubProxy = this.connection.createHubProxy('Vocal');
  }

  Start() {
    this.connection.start()
    .done(() => { 
      console.log('Now connected, connection ID=' + this.connection.id); 
      this.hubProxy.invoke('Connect', params.User.Id);
    })
    .fail(function(){ console.log('Could not connect'); });
  }

}
