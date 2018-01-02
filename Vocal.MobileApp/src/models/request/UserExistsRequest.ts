import {Request} from './Request';

export class UserExistsRequest extends Request {
    Value: string;

    constructor() {
        super();
    }
}