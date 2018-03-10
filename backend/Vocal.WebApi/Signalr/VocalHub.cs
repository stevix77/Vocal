using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocal.Business.Tools;
using Vocal.Model.Response;
using Vocal.Model.Signalr;

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

        public void SubscribeToTalks(List<string> talks)
        {
            foreach (var item in talks)
                Groups.Add(Context.ConnectionId, item);
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
            var connectionsId = GetConnectionsId(userId);
            if (connectionsId != null)
                foreach (var item in connectionsId)
                    Groups.Add(item, talkId);
        }

        public void LeaveTalk(string userId, string talkId)
        {
            var connectionsId = _users[userId];
            foreach (var item in connectionsId)
                Groups.Remove(item, talkId);
        }

        #region Envoi de message

        public void Send(List<string> usersId, SendMessageResponse obj)
        {
            foreach (var item in usersId)
                JoinTalk(item, obj.Talk.Id);
            JoinTalk(obj.Message.User.Id, obj.Talk.Id);
            this.Clients.Group(obj.Talk.Id).Receive(obj);
        }

        public void AddFriend(List<string> ids, string username)
        {
            LogManager.LogDebug(ids, username);
            foreach (var id in ids)
            {
                var connections = GetConnectionsId(id);
                if (connections != null)
                    foreach (var item in connections)
                        Clients.Client(item).AddFriend(username);
            }
        }

        public void BeginTalk(string talkId, string username)
        {
            Clients.OthersInGroup(talkId).BeginTalk(username);
        }

        public void EndTalk(string talkId)
        {
            Clients.OthersInGroup(talkId).EndTalk();
        }

        public void UpdateListenUser(string talkId, List<MessageResponse> obj)
        {
            Clients.Group(talkId, Context.ConnectionId).UpdateListenUser(obj);
        }

        #endregion
    }
}