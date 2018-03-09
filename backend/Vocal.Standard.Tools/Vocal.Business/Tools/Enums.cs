namespace Vocal.Business.Tools
{
    public enum KeyStore
    {
        Friends = 0,
        Talks = 1,
        Settings = 2,
        FriendsAddedMe = 3
    }

    public enum HubMethod
    {
        Connect,
        Send,
        UpdateListenUser,
        AddFriend
    }

    public enum NotifType : int
    {
        Talk = 0,
        AddFriend = 1,
        Follow = 2
    }
}
