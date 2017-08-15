using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Vocal.Business.Tools;
using Vocal.Business.Properties;

namespace Vocal.WebApi.Signalr
{
    [HubName("Vocal")]
    public class VocalHub : Hub
    {
        private static Dictionary<string, string> _users = new Dictionary<string, string>();

        public override Task OnConnected()
        {
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            _users.Remove(_users.SingleOrDefault(x => x.Value == Context.ConnectionId).Key);
            return base.OnDisconnected(stopCalled);
        }

        public void Connect(string userId)
        {
            if (_users.ContainsKey(userId))
                _users[userId] = Context.ConnectionId;
            else
                _users.Add(userId, Context.ConnectionId);
        }

        public void JoinTalk(string userId, string talkId)
        {
            var connectionId = _users[userId];
            Groups.Add(connectionId, talkId);
        }

        public void LeaveTalk(string userId, string talkId)
        {
            var connectionId = _users[userId];
            Groups.Remove(connectionId, talkId);
        }

        //public void SendMessage(Message mess, string talkId)
        //{

        //}

        public void BeginTalkMess(string username, string talkId, string lang)
        {
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            var message = $"{username} {Resources_Language.TalkingMessage}";
            Clients.OthersInGroup(talkId).Talking(message);
        }

        public void EndTalkMess(string username, string talkId, string lang)
        {
            Clients.OthersInGroup(talkId).EndTalking();
        }

    }
}