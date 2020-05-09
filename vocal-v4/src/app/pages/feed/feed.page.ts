import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit() {
    console.log(this.storeService.get('user'));
  }

}
