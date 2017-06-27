import {Request} from './Request';

export class SearchFriendsRequest extends Request {
    Emails: Array<string> = [];
    constructor() {
        super();
    }
}