import { Component } from '@angular/core';
import { FeedPage } from '../../pages/feed/feed';
import { DiscoverPage } from '../../pages/discover/discover';
import { SendVocalPage } from '../../pages/send-vocal/send-vocal';
import { MessagePage } from '../../pages/message/message';
import { ModalEditVocalPage } from '../../pages/modal-edit-vocal/modal-edit-vocal';
import { VocalListPage } from '../../pages/vocal-list/vocal-list';
import { ProfilePage } from '../../pages/profile/profile';

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
  tab3Root = ModalEditVocalPage;
  tab4Root = VocalListPage;
  tab5Root = ProfilePage;

  constructor() {
  }

}
