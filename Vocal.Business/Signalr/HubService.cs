using Microsoft.AspNet.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Vocal.Business.Properties;
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
                Connection = new HubConnection(Settings.Default.HostHub);
                Proxy = Connection.CreateHubProxy(Settings.Default.Hubname);
                await Connection.Start();
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
            await Proxy.Invoke(HubMethod.Send.ToString(), data, idsRecipient);
        }
    }
}
