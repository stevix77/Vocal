import { PictureResponse } from "./response/pictureResponse";

export class AppUser {
constructor(){}

	id: string;
	email: string;
	firstname: string;
	lastname: string;
	username: string;
  token : string;
	pictures: Array<PictureResponse> = new Array<PictureResponse>();
}