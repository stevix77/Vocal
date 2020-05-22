import { Component, OnInit } from '@angular/core';
import { UpdateType } from 'src/app/models/enums';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  pseudoParams = {title:'Pseudo', value:'tikfromparis', updateType: UpdateType.Username}
  constructor() { }

  ngOnInit() {
  }

}
