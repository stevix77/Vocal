import { Component, Input } from '@angular/core';
import { UserResponse } from '../../models/response/userResponse';

/**
 * Generated class for the SelectFriendsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'select-friends',
  templateUrl: 'select-friends.html'
})
export class SelectFriendsComponent {

  text: string;
  @Input() Friends: Array<UserResponse>;

  constructor() {
    console.log('Hello SelectFriendsComponent Component');
    this.text = 'Hello World';
  }

}
