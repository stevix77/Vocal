import {SettingsResponse} from './SettingsResponse';
import {UserResponse} from './UserResponse';
import {TalkResponse} from './TalkResponse';
import {KeyValueResponse} from './KeyValueResponse';

export class InitResponse{
    Settings: SettingsResponse;
    Friends: Array<UserResponse>;
    FriendsAddedMe: Array<UserResponse>;
    Talks: Array<TalkResponse>;
    Errors: Array<KeyValueResponse<string, string>>;
}