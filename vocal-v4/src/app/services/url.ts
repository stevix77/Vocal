export
var url = {

    //  BaseUri: "http://192.168.1.14:8017",
    //BaseUri: "http://vocal.westeurope.cloudapp.azure.com",
    BaseUri: "https://wsvocal.azurewebsites.net",
    //BaseUri: "http://localhost/Vocal.WebApi/api/",
    
    // Auth
    Signin() : string {
        return this.BaseUri + "/auth/signin";
    },
    Register() : string {
        return this.BaseUri + "/auth/register"
    },
    AskPwd() : string {
        return this.BaseUri + "/auth/askpassword";
    },
    UpdateUser() : string {
        return this.BaseUri + "/auth/update";
    },
    ResetPwd() : string {
        return this.BaseUri + "/auth/resetpassword";
    },

    // User
    IsExistsUsername(username: string) : string {
        return this.BaseUri + "/users/IsExistsUsername/" + username;
    },
    IsExistsEmail(email: string) : string {
        return this.BaseUri + "/users/IsExistsEmail/" + email;
    },
    GetProfil(userId: string) : string {
        return this.BaseUri + "/users/" + userId;
    },
    BlockPeople(userId: string) : string {
        return this.BaseUri + "/users/" + userId + "/block";
    },
    UnblockPeople(userId: string) : string {
        return this.BaseUri + "/users/" + userId + "/unblock";
    },
    GetBlockedList() : string {
        return this.BaseUri + "/users/block";
    },


    // Follow

    GetFollowers(pageNumber: number, pageSize: number) : string {
        return this.BaseUri + "/followers/" + pageNumber + "/" + pageSize;
    },
    GetFollowing(pageNumber: number, pageSize: number) : string {
        return this.BaseUri + "/following/" + pageNumber + "/" + pageSize;
    },
    Follow(userId: string) {
        return this.BaseUri + "/" + userId + "/follow/";
    },
    UnFollow(userId: string) {
        return this.BaseUri + "/" + userId + "/unfollow/";
    },


    // Notification
    NotificationRegister() : string {
        return this.BaseUri + "/notification/register"
    },
    DeleteNotificationRegistration(registrationId: string) : string {
        return this.BaseUri + "/notification/delete/" + registrationId;
    },


    // Search
    SearchContact() : string {
        return this.BaseUri + "/search/contacts";
    },
    SearchPeople(keyword: string) : string {
        return this.BaseUri + "/search/" + keyword;
    },


    // Talk
    GetMessages(talkId: string) : string {
        return this.BaseUri + "/talks/" + talkId + "/messages";
    },
    GetPublicMessages(userId: string) : string {
        return this.BaseUri + "/talks/messages/" + userId;
    },
    GetTalkList() : string {
        return this.BaseUri + "/talks";
    },
    SendMessage() : string {
        return this.BaseUri + "/talks/send";
    },
    SendMessageToTalk(talkId: string) : string {
        return this.BaseUri + "/talks/send/talk/" + talkId;
    },
    SendMessageToUser(userId: string) : string {
        return this.BaseUri + "/talks/send/user/" + userId;
    },
    GetMessageById(messageId: string) : string {
        return this.BaseUri + "/talks/message/" + messageId;
    },
    CreateTalk() : string {
        return this.BaseUri + "/talks/create";
    },
    DeleteTalk(talkId: string) : string {
        return this.BaseUri + "/talks/" + talkId + "/delete";
    },
    ArchiveTalk(talkId: string) : string {
        return this.BaseUri + "/talks/" + talkId + "/archive";
    },
    UnarchiveTalk(talkId: string) : string {
        return this.BaseUri + "/talks/" + talkId + "/unarchive";
    },
    DeleteMessage(talkId: string, messageId: string) {
        return this.BaseUri + "/talks/" + talkId + "/messages/" + messageId + "/delete";
    },
    TranslateMessage(messageId: string) {
        return this.BaseUri + "/talks/translate/" + messageId;
    }
}
