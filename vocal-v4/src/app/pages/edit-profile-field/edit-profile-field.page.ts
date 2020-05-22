import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserApiService } from 'src/app/api/user-api.service';

@Component({
  selector: 'app-edit-profile-field',
  templateUrl: './edit-profile-field.page.html',
  styleUrls: ['./edit-profile-field.page.scss'],
})
export class EditProfileFieldPage implements OnInit {
  data: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userApi: UserApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.data = params
    })
  }

  async updateField() {
    await this.userApi.updateUserField(this.data.updateType, this.data.value);
    this.router.navigate(['/edit-profile']);
  }

}
