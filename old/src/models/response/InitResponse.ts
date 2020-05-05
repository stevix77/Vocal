import {SettingsResponse} from './settingsResponse';
import {UserResponse} from './userResponse';
import {TalkResponse} from './talkResponse';
import {KeyValueResponse} from './keyValueResponse';

export class InitResponse{
    Settings: SettingsResponse;
    Friends: Array<UserResponse>;
    Talks: Array<TalkResponse>;
    Errors: Array<KeyValueResponse<string, string>>;
}