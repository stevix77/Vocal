import { Component } from '@angular/core';

/**
 * Generated class for the MainTabsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'main-tabs',
  templateUrl: 'main-tabs.html'
})
export class MainTabsComponent {

  text: string;

  constructor() {
    console.log('Hello MainTabsComponent Component');
    this.text = 'Hello World';
  }

}
