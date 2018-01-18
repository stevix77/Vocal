import {UserResponse} from './userResponse';
export class SettingsResponse {
    Name: string;
    Email: string;
    BirthdayDate: Date;
    IsNotifiable: boolean;
    Blocked: Array<UserResponse>;
    Contacts: Array<any>;
    Genders: Array<any>;
}