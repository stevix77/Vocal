import { Component, OnInit } from '@angular/core';
import { UpdateType } from 'src/app/models/enums';
import { UserResponse } from 'src/app/models/response/userResponse';
import { UserStoreService } from 'src/app/store/user-store.service';

export interface UpdateProfileFieldParams {
  title: string
  field: string
  updateType: UpdateType
  value: string
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  user: UserResponse = new UserResponse();
  usernameParams;
  lastnameParams;
  constructor(
    private userStore: UserStoreService
  ) { }

  async ngOnInit() {
    this.initData();
  }
  
  ionViewWillEnter() {
    this.initData();
  }

  async initData() {
    this.user = await this.userStore.getUser();
    this.initQueryParams();
  }

  initQueryParams() {
    this.usernameParams = {title:'Pseudo', value: this.user.username, updateType: UpdateType.Username, field: "username"};
    this.lastnameParams = {title:'Nom', value: this.user.lastname, updateType: UpdateType.Lastname, field: "lastname"};
  }

}
