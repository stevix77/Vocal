using Microsoft.AspNet.SignalR.Client;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Vocal.Business.Tools;
using Vocal.Model.Response;

namespace Vocal.Business.Signalr
{
    public sealed class HubService
    {
        private HubService()
        {
            Thread = new Thread(async () =>
            {
                Connection = new HubConnection(Properties.Settings.Default.HostHub);
                Proxy = Connection.CreateHubProxy(Properties.Settings.Default.Hubname);
                await Connection.Start();
                Connection.StateChanged += async (e) => { if (e.NewState == ConnectionState.Disconnected) await Connection.Start(); };
            })
            { IsBackground = true };

            Thread.Start();
        }

        static HubService() { }


        private IHubProxy Proxy { get; set; }
        private HubConnection Connection { get; set; }
        private Thread Thread { get; set; }

        private static readonly HubService _instance = new HubService();
        public static HubService Instance
        {
            get
            {
                return _instance;
            }
        }

        internal async Task SendMessage(SendMessageResponse data, List<string> idsRecipient)
        {
            await Proxy.Invoke(HubMethod.Send.ToString(), idsRecipient, data);
        }

        internal async Task UpdateTalk(string talkId, List<MessageResponse> list)
        {
            await Proxy.Invoke(HubMethod.UpdateListenUser.ToString(), talkId, list);
        }

        internal async Task AddFriends(List<string> ids, string username)
        {
            await Proxy.Invoke(HubMethod.AddFriend.ToString(), ids, username);
        }
    }
}
