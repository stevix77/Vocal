import { PictureResponse } from "./response/pictureResponse";

export class AppUser {
constructor(){}

	Id: string;
	Email: string;
	Firstname: string;
	Lastname: string;
	Username: string;
    Token : string;
    Pictures: Array<PictureResponse> = new Array<PictureResponse>();
}