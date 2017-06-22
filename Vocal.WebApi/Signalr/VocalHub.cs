using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

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

    }
}