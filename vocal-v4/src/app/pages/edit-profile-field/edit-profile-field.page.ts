import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile-field',
  templateUrl: './edit-profile-field.page.html',
  styleUrls: ['./edit-profile-field.page.scss'],
})
export class EditProfileFieldPage implements OnInit {
  data: any;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.data = params
    })
  }

}
