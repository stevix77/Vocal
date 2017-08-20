export enum UpdateType {
    Gender = 0,
    Password = 1,
    Email = 2,
    Contact = 3,
    Notification = 4,
    BirthdayDate = 5
}

export enum KeyStore {
    Settings = 0,
    User = 1,
    Friends = 2,
    Talks = 3
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