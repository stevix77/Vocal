import {Request} from './request';

export class ManageFriendsRequest extends Request {

    Ids: Array<string> = [];
    UserId: string;
    Lang: string;
    constructor() {
        super();
    }
}