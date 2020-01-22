import { Component } from '@angular/core';
import { FeedPage } from '../../pages/feed/feed';
import { DiscoverPage } from '../../pages/discover/discover';
import { SendVocalPage } from '../../pages/send-vocal/send-vocal';
import { MessagePage } from '../../pages/message/message';

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

  tab1Root = FeedPage;
  tab2Root = DiscoverPage;
  tab3Root = SendVocalPage;
  tab4Root = MessagePage;

  constructor() {
  }

}
