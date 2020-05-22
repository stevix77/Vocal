import { PictureResponse } from "./pictureResponse";

export class UserResponse {
    id: string;
    email: string;
    username: string;
    lastname: string;
    pictures: Array<PictureResponse> = new Array<PictureResponse>();
}