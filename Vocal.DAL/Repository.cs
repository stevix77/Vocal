using System;
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

        public void SaveSign(Sign sign)
        {
            var collection = _db.GetCollection<Sign>(Settings.Default.CollectionSign);
            collection.InsertOne(sign);
        }

        public Sign GetSignature(string sign)
        {
            var collection = _db.GetCollection<Sign>(Settings.Default.CollectionSign);
            return collection.Find(x => x.Id == sign).SingleOrDefault();
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

        public User GetUserByEmail(string email)
        {
            var db = _db.GetCollection<User>(Settings.Default.CollectionUser);
            var user = db.Find(x => x.Email == email).SingleOrDefault();
            return user;
        }

        public User GetUserByUsername(string username)
        {
            var db = _db.GetCollection<User>(Settings.Default.CollectionUser);
            var user = db.Find(x => x.Username == username).SingleOrDefault();
            return user;
        }
        

        #endregion

        #region Vocal

        public List<Talk> GetListTalk(string userId)
        {
            var db = _db.GetCollection<Talk>(Settings.Default.CollectionTalk);
            var list = db.Find(x => x.Users.Exists(y => y.Id == userId))
                        .SortByDescending(x => x.Messages.Select(y => y.Date))
                        .Project(x => new Talk { Id = x.Id, VocalName = x.VocalName, Users = x.Users, Messages = x.Messages.OrderByDescending(y => y.Date).Take(1).ToList()})
                        .ToList();
            return list;
        }

        #endregion

        #region Friends

        public List<User> SearchFriendsByEmails(List<string> emails)
        {
            List<User> users = new List<User>();
            var db = _db.GetCollection<User>(Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Email, emails);
            users = db.Find(filter).ToList();
            return users;
        }

        public List<User> SearchFriendsByIds(List<string> ids)
        {
            List<User> users = new List<User>();
            var db = _db.GetCollection<User>(Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, ids);
            users = db.Find(filter).ToList();
            return users;
        }

        public bool AddFriends(string userId, List<string> ids)
        {
            bool success = false;
            var db = _db.GetCollection<User>(Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, ids);
            var users = db.Find(filter).ToList();
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                List<Friend> friends = Bind_UsersToFriends(users);
                user.Friends.AddRange(friends);
                db.ReplaceOne(x => x.Id == userId, user);
                success = true;
            }
            return success;
        }


        #endregion

        #region Private methods

        private List<Friend> Bind_UsersToFriends(List<User> users)
        {
            var list = new List<Friend>();
            foreach (var item in users)
            {
                list.Add(new Friend
                {
                    Email = item.Email,
                    Firstname = item.Firstname,
                    Id = item.Id,
                    Lastname = item.Lastname,
                    Picture = item.Picture,
                    Username = item.Username
                });
            }
            return list;
        }

        #endregion

    }
}
