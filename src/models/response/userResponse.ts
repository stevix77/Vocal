import { PictureResponse } from "./pictureResponse";

export class UserResponse {
    Id: string;
    Email: string;
    Username: string;
    Firstname: string;
    Lastname: string;
    Pictures: Array<PictureResponse> = new Array<PictureResponse>();
}