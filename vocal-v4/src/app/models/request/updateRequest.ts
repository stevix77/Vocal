import {Request} from './request';

export class UpdateRequest extends Request {

    UpdateType: number;
    Value: any;
    Lang: string;
    constructor() {
        super();
    }
}