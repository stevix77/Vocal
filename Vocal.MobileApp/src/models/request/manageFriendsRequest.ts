import {Request} from './Request';

export class ManageFriendsRequest extends Request {

    Ids: Array<string> = [];
    UserId: string;
    constructor() {
        super();
    }
}