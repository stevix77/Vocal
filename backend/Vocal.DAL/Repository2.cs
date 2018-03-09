using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using Vocal.Model.DB;
using Vocal.Model.Request;
using Vocal.Model.Helpers;
using MongoDB.Bson;

namespace Vocal.DAL
{
    public sealed partial class  Repository2
    {
        private Repository2()
        {
            MongoDB.Bson.Serialization.BsonClassMap.RegisterClassMap<SendMessageRequest>();
            MongoDB.Bson.Serialization.BsonClassMap.RegisterClassMap<DeleteMessageRequest>();
            MongoDB.Bson.Serialization.BsonClassMap.RegisterClassMap<UpdateTalkRequest>();
        }

        static Repository2() {
        }

        private static readonly Repository2 _instance = new Repository2();

        public static Repository2 Instance
        {
            get
            {
                return _instance;
            }
        }

        private static MongoClient _client = GetClient();
        private static IMongoDatabase _db = GetDatabase();

        private static IMongoDatabase GetDatabase()
        {
            return _client.GetDatabase("Vocal"); // mettre dans un fichier de conf
        }

        private static MongoClient GetClient()
        {
            MongoClientSettings settings = new MongoClientSettings();
            settings.Server = new MongoServerAddress("localhost", 27017); // mettre dans un fichier de conf
            //MongoIdentity identity = new MongoInternalIdentity("Vocal", "");
            //MongoIdentityEvidence evidence = new PasswordEvidence("");
//#if !DEBUG
//                //settings.UseSsl = true;
//                //settings.SslSettings = new SslSettings();
//                //settings.SslSettings.EnabledSslProtocols = System.Security.Authentication.SslProtocols.Tls12;
//                settings.Credentials = new List<MongoCredential>()
//                {
//                    new MongoCredential("SCRAM-SHA-1", identity, evidence)
//                };
//#endif
            //settings.Credentials = new List<MongoCredential>()
            //{
            //    new MongoCredential("SCRAM-SHA-1", identity, evidence)
            //};
            MongoClient client = new MongoClient(settings);
            return client;
        }

        public List<User> GetAllUsers()
        {
            var users = new List<User>();
            var db = _db.GetCollection<User>("User"); // mettre dans un fichier de conf
            users = db.AsQueryable().ToList();
            return users;
        }


    }
}
