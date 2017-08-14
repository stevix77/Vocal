import {Request} from './Request';

export class UpdateRequest extends Request {

    UpdateType: number;
    Value: any;
    constructor() {
        super();
    }
}