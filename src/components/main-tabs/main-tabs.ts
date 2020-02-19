import { Component } from '@angular/core';
import { FeedPage } from '../../pages/feed/feed';
import { DiscoverPage } from '../../pages/discover/discover';
import { VocalListPage } from '../../pages/vocal-list/vocal-list';
import { ProfilePage } from '../../pages/profile/profile';
import { RecordVocalPage } from '../../pages/record-vocal/record-vocal';
import { Events } from 'ionic-angular';

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
  tab3Root = RecordVocalPage;
  tab4Root = VocalListPage;
  tab5Root = ProfilePage;

  constructor(
    public events: Events
  ) {
  }

}
