using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Tools;

namespace Vocal.Business.Tools
{
    public enum KeyStore
    {
        Friends = 0,
        Talks = 1,
        Settings = 2
    }

    public enum HubMethod
    {
        Connect,
        Send
    }

    public enum NotifType
    {
        Talk,
        AddFriend,
        Follow
    }
}
