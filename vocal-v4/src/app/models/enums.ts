export enum UpdateType {
    Gender = 0,
    Password = 1,
    Email = 2,
    Contact = 3,
    Notification = 4,
    BirthdayDate = 5,
    Blocked = 6,
    Picture = 7,
    Username = 8,
    Lastname = 9
}

export enum KeyStore {
    Settings = 0,
    User = 1,
    Friends = 2,
    Talks = 3,
    Messages = 4,
    FriendsAddedMe = 5,
    Draft = 6,
    Token = 7
}

export enum Store {
    apns, // iOs
    wns, // Windows
    gcm // Android
}

export enum MessageType {
    Vocal = 1,
    Text = 2
}

export enum PictureType {
    Profil = 0,
    Talk = 1
}

export enum HubMethod {
    Connect,
    Send,
    Receive,
    SubscribeToTalks,
    UpdateListenUser,
    BeginTalk,
    EndTalk,
    AddFriend
}

export enum NotifType {
    Talk = 0,
    AddFriend = 1,
    Follow = 2
}
