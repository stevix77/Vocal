using Microsoft.AspNet.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Vocal.Business.Properties;

namespace Vocal.Business.Signalr
{
    public class HubService
    {
        public IHubProxy Proxy { get; set; }
        public HubConnection Connection { get; set; }
        public Thread Thread { get; set; }

        public HubService()
        {
            Thread = new Thread(async () =>
            {
                Connection = new HubConnection(Settings.Default.HostHub);
                Proxy = Connection.CreateHubProxy("Vocal");
                await Connection.Start();
            })
            { IsBackground = true };

            Thread.Start();
        }
    }
}
