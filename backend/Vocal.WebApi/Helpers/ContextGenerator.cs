using Vocal.Model.Context;
using System.Configuration;
using System.Linq;

namespace Vocal.WebApi.Helpers
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
                DefaultFullSharedAccessSignature = GetConfig("DefaultFullSharedAccessSignature", ""),
                Hubname = GetConfig("Hubname", "vocal")
            };
        }

        static T GetConfig<T>(string key, T Default) where T  : new()
        {
            if(ConfigurationManager.AppSettings.AllKeys.All( k => k != key))
                return Default;
            var reader = new AppSettingsReader();
            return (T) reader.GetValue(key, typeof(T));
        }

        static string GetConfig(string key, string Default)
        {
            return ConfigurationManager.AppSettings[key] ?? Default;
        }
    }
}