import {Request} from './Request';

export class AddFriendsRequest extends Request {

    Ids: Array<string> = [];
    UserId: string;
    constructor() {
        super();
    }
}