using Elmah;
using System;
using System.Linq;

namespace Vocal.Business.Tools
{
    public static class LogManager
    {
        public static void LogError(Exception ex)
        {
            //ErrorLog.GetDefault(System.Web.HttpContext.Current).Log(new Error(ex));
            ErrorSignal.FromCurrentContext().Raise(ex);
        }

        public static void LogDebug(string log)
        {
            ErrorLog.GetDefault(System.Web.HttpContext.Current).Log(new Error { Message = log, Type = "DEBUG", Time = DateTime.Now, HostName = Environment.MachineName, User = Environment.UserName, ApplicationName = "Vocal" });
        }

        public static void LogDebug(params object[] obj)
        {
            var caller = new System.Diagnostics.StackTrace().GetFrame(1).GetMethod();
            if(caller.Name.ToLower() == "movenext")
                caller = new System.Diagnostics.StackTrace().GetFrame(3).GetMethod();
            var parameters = caller.GetParameters().ToList();
            string message = caller.Name;
            int i = 0;
            parameters.ForEach(x =>
            {
                message += string.Format(" - {0}: {1}", x.Name, Newtonsoft.Json.JsonConvert.SerializeObject(obj[i]));
                i++;
            });
            ErrorLog.GetDefault(System.Web.HttpContext.Current).Log(new Error { Message = message, Type = "DEBUG", Time = DateTime.Now, HostName = Environment.MachineName, User = Environment.UserName, ApplicationName = "Vocal" });
        }
    }
}
