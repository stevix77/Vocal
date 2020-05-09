import { PictureResponse } from "./pictureResponse";

export class UserResponse {
    id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    pictures: Array<PictureResponse> = new Array<PictureResponse>();
    token: string;
}