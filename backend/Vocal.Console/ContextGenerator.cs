using Vocal.Model.Context;
using System.Configuration;
using System.Linq;
using System;

namespace Vocal.Console.Helpers
{
    public static class ContextGenerator
    {
        public static DbContext GetDbContext()
        {
            return new DbContext
            {
                Host = GetConfig("host", "localhost"),
                Port = GetConfig("Port", 27017),
                DocumentDBName = GetConfig("DocumentDBName", "Vocal"),
                DocumentDBUser = GetConfig("DocumentDBUser", ""),
                DocumentDBPwd = GetConfig("DocumentDBPwd", ""),
                CollectionUser = GetConfig("CollectionUser", "User"),
                CollectionMessage = GetConfig("CollectionMessage", "Message"),
                CollectionMonitoring = GetConfig("CollectionMonitoring", "Monitoring"),
                CollectionSearch = GetConfig("CollectionSearch", "Search"),
                CollectionTalk = GetConfig("CollectionTalk", "Talk"),
                CollectionSign = GetConfig("CollectionSign", "Sign"),
            };
        }

        public static HubContext GetHubContext()
        {
            return new HubContext
            {
                DefaultFullSharedAccessSignature = GetConfig("DefaultFullSharedAccessSignature", "Endpoint=sb://mobileappvocal.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=h6TObd/MF8tY9JiQjiHRj4c3C2+XYjbYQe0CzgZnmoA="),
                Hubname = GetConfig("Hubname", "vocal")
            };
        }

        static T GetConfig<T>(string key, T Default) where T : new()
        {
            //if(ConfigurationManager.AppSettings.AllKeys.All( k => k != key))
            //    return Default;
            var reader = new AppSettingsReader();
            return Default;
            //return (T) reader.GetValue(key, typeof(T));
        }

        static string GetConfig(string key, string Default)
        {
            //var reader = new AppSettingsReader();
            return Default;
            //return ConfigurationManager.AppSettings[key] ?? Default;
        }
    }
}