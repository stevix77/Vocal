import {Request} from './request';

export class UserExistsRequest extends Request {
    Value: string;

    constructor() {
        super();
    }
}