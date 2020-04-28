export
var url = {

    //  BaseUri: "http://192.168.1.14:8017",
    //BaseUri: "http://vocal.westeurope.cloudapp.azure.com",
    BaseUri: "https://wsvocal.azurewebsites.net",
    //BaseUri: "http://localhost/Vocal.WebApi/api/",
    
    // Auth
    Signin() : string {
        return this.BaseUri + "/auth/login";
    },
    Register() : string {
        return this.BaseUri + "/auth/register"
    },
    AskPwd() : string {
        return this.BaseUri + "/auth/askpassword"
    },
    UpdateUser() : string {
        return this.BaseUri + "/auth/update"
    },

    // User
    IsExistsUsername(username: string) : string {
        return this.BaseUri + "/user/IsExistsUsername/" + username;
    },
    IsExistsEmail(email: string) : string {
        return this.BaseUri + "/api/user/IsExistsEmail/" + email;
    },
    GetProfil(userId: string) : string {
        return this.BaseUri + "/user/profil/" + userId;
    },
    BlockPeople(userId: string) : string {
        return this.BaseUri + "/user/block/" + userId;
    },
    UnblockPeople(userId: string) : string {
        return this.BaseUri + "/user/unblock/" + userId;
    },
    GetBlockedList() : string {
        return this.BaseUri + "/user/block/list";
    },


    // Follow

    GetFollowers(pageNumber: number, pageSize: number) : string {
        return this.BaseUri + "/follow/getfollowers/" + pageNumber + "/" + pageSize;
    },
    GetFollowing(pageNumber: number, pageSize: number) : string {
        return this.BaseUri + "/follow/getfollowing/" + pageNumber + "/" + pageSize;
    },
    Follow(userId: string) {
        return this.BaseUri + "/follow/" + userId;
    },
    UnFollow(userId: string) {
        return this.BaseUri + "/follow/unfollow/" + userId;
    },


    // Notification
    NotificationRegister() : string {
        return this.BaseUri + "/notification/register"
    },
    DeleteNotificationRegistration(registrationId: string) : string {
        return this.BaseUri + "/notification/registration/delete/" + registrationId;
    },


    // Search
    SearchContact() : string {
        return this.BaseUri + "/search/contact";
    },
    SearchPeople(keyword: string) : string {
        return this.BaseUri + "/search/people/" + keyword;
    },


    // Talk
    GetMessages(talkId: string) : string {
        return this.BaseUri + "/talk/messages/" + talkId;
    },
    GetPublicMessages(userId: string) : string {
        return this.BaseUri + "/talk/messages/public" + userId;
    },
    GetTalkList() : string {
        return this.BaseUri + "/talk/list";
    },
    SendMessage() : string {
        return this.BaseUri + "/talk/sendMessage";
    },
    SendMessageToTalk(talkId: string) : string {
        return this.BaseUri + "/talk/sendMessage/talk/" + talkId;
    },
    SendMessageToUser(userId: string) : string {
        return this.BaseUri + "/talk/sendMessage/user/" + userId;
    },
    GetMessageById(messageId: string) : string {
        return this.BaseUri + "/talk/message/" + messageId;
    },
    CreateTalk() : string {
        return this.BaseUri + "/talk/createTalk";
    },
    DeleteTalk(talkId: string) : string {
        return this.BaseUri + "/talk/deleteTalk/" + talkId;
    },
    ArchiveTalk(talkId: string) : string {
        return this.BaseUri + "/talk/ArchiveTalk/" + talkId;
    },
    UnarchiveTalk(talkId: string) : string {
        return this.BaseUri + "/talk/unarchiveTalk/" + talkId;
    },
    DeleteMessage(talkId: string, messageId: string) {
        return this.BaseUri + "/talk/" + talkId + "/DeleteMessage/" + messageId;
    },
    TranslateMessage(messageId: string) {
        return this.BaseUri + "/talk/translate/" + messageId;
    }
}