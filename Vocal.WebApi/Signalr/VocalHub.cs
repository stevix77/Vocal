using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Vocal.Business.Tools;
using Vocal.Business.Properties;
using Vocal.Model.Response;

namespace Vocal.WebApi.Signalr
{
    [HubName("Vocal")]
    public class VocalHub : Hub
    {
        private static Dictionary<string, List<string>> _users = new Dictionary<string, List<string>>();

        public override Task OnConnected()
        {
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            _users.SingleOrDefault(x => x.Value.Any(y => y == Context.ConnectionId)).Value.Remove(Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }

        public void Connect(string userId)
        {
            if (_users.ContainsKey(userId))
                _users[userId].Add(Context.ConnectionId);
            else
                _users.Add(userId, new List<string> { Context.ConnectionId });
        }

        private List<string> GetConnectionsId(string userId)
        {
            if (_users.ContainsKey(userId))
                return _users[userId];
            else
                return null;
        }

        public void JoinTalk(string userId, string talkId)
        {
            var connectionId = _users[userId];
            foreach(var item in connectionId)
                Groups.Add(item, talkId);
        }

        public void LeaveTalk(string userId, string talkId)
        {
            //var connectionId = _users[userId];
            //Groups.Remove(connectionId, talkId);
        }

        public void Send(SendMessageResponse response, List<string> usersId)
        {
            foreach(var item in usersId)
            {
                var connectionsId = GetConnectionsId(item);
                if(connectionsId != null)
                    JoinTalk(response.Message.User.Id, response.Talk.Id);
            }
            JoinTalk(response.Message.User.Id, response.Talk.Id);
            this.Clients.Group(response.Talk.Id).Receive(response);
        }

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