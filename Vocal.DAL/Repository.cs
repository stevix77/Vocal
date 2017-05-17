﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB;
using Vocal.DAL.Properties;
using Vocal.Model;
using Vocal.Model.DB;

namespace Vocal.DAL
{
    public class Repository
    {
        private static MongoClient _client = GetClient();
        private static IMongoDatabase _db = GetDatabase();

        private static IMongoDatabase GetDatabase()
        {
            return _client.GetDatabase(Settings.Default.DocumentDBName);
        }

        private static MongoClient GetClient()
        {
            MongoClientSettings settings = new MongoClientSettings();
            settings.Server = new MongoServerAddress(Settings.Default.Host, Settings.Default.Port);
            MongoIdentity identity = new MongoInternalIdentity(Settings.Default.DocumentDBName, Settings.Default.DocumentDBUser);
            MongoIdentityEvidence evidence = new PasswordEvidence(Settings.Default.DocumentDBPwd);
#if !DEBUG
                //settings.UseSsl = true;
                //settings.SslSettings = new SslSettings();
                //settings.SslSettings.EnabledSslProtocols = System.Security.Authentication.SslProtocols.Tls12;
                settings.Credentials = new List<MongoCredential>()
                {
                    new MongoCredential("SCRAM-SHA-1", identity, evidence)
                };
#endif
            //settings.Credentials = new List<MongoCredential>()
            //{
            //    new MongoCredential("SCRAM-SHA-1", identity, evidence)
            //};
            MongoClient client = new MongoClient(settings);
            return client;
        }

        #region Authentification

        public User Login(string login, string password)
        {
            var collection = _db.GetCollection<User>(Settings.Default.CollectionUser);
            var user = collection.Find(x => x.Password == password && (x.Email == login || x.Username == login)).SingleOrDefault();
            return user;
        }

        public void AddUser(User user)
        {
            var collection = _db.GetCollection<User>(Settings.Default.CollectionUser);
            collection.InsertOne(user);
        }

        #endregion

        #region User 

        public User GetUserById(string id)
        {
            var db = _db.GetCollection<User>(Settings.Default.CollectionUser);
            var user = db.Find(x => x.Id == id).SingleOrDefault();
            return user;
        }

        #endregion
    }
}
