namespace Vocal.Model.Context
{
    public class DbContext
    {
        public string Host { get; set; }
        public int Port { get; set; }

        public string DocumentDBName { get; set; }
        public string DocumentDBUser { get; set; }
        public string DocumentDBPwd { get; set; }

        public string CollectionUser { get; set; }
        public string CollectionTalk { get; set; }
        public string CollectionMessage { get; set; }
        public string CollectionMonitoring { get; set; }
        public string CollectionSearch { get; set; }
        public string CollectionSign { get; set; }
    }
}
