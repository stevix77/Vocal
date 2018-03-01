using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Vocal.WebApi.Signalr.Startup))]
namespace Vocal.WebApi.Signalr
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}