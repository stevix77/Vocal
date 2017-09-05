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
    public sealed class Repository
    {
        private Repository()
        {
        }

        static Repository() { }

        private static readonly Repository _instance = new Repository();
        public static Repository Instance
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
            return _client.GetDatabase(Properties.Settings.Default.DocumentDBName);
        }

        private static MongoClient GetClient()
        {
            MongoClientSettings settings = new MongoClientSettings();
            settings.Server = new MongoServerAddress(Properties.Settings.Default.Host, Properties.Settings.Default.Port);
            MongoIdentity identity = new MongoInternalIdentity(Properties.Settings.Default.DocumentDBName, Properties.Settings.Default.DocumentDBUser);
            MongoIdentityEvidence evidence = new PasswordEvidence(Properties.Settings.Default.DocumentDBPwd);
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
            var collection = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = collection.Find(x => x.Password == password && (x.Email == login || x.Username == login)).SingleOrDefault();
            return user;
        }

        public void SaveSign(string userId, string sign)
        {
            var collection = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = collection.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                user.Signs.Add(sign);
                collection.ReplaceOne(x => x.Id == userId, user);
            }
        }

        public bool GetSignature(string sign)
        {
            var collection = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            return collection.Find(x => x.Signs.Contains(sign)).Any();
        }

        #endregion

        #region User 

        public void AddUser(User user)
        {
            var collection = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            collection.InsertOne(user);
        }

        public User GetUserById(string id)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Id == id).SingleOrDefault();
            return user;
        }

        public User GetUserByEmail(string email)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Email == email).SingleOrDefault();
            return user;
        }

        public User GetUserByUsername(string username)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Username == username).SingleOrDefault();
            return user;
        }

        public void UpdateUser(User user)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            db.ReplaceOne(x => x.Id == user.Id, user);
        }

        public bool CheckIfAllUsersExist(List<string> userIds)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, userIds);
            return db.Count(filter) == userIds.Count;
        }

        public List<User> GetUsersById(List<string> userIds)
        {
            List<User> users = new List<User>();
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, userIds);
            users = db.Find(filter).ToList();
            return users;
        }

        #endregion

        #region Friends

        public List<User> SearchFriendsByEmails(List<string> emails)
        {
            List<User> users = new List<User>();
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Email, emails);
            users = db.Find(filter).ToList();
            return users;
        }

        public List<User> SearchFriendsByIds(List<string> ids)
        {
            List<User> users = new List<User>();
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, ids);
            users = db.Find(filter).ToList();
            return users;
        }

        public bool AddFriends(string userId, List<string> ids)
        {
            bool success = false;
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, ids);
            var users = db.Find(filter).ToList();
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                List<People> friends = Bind_UsersToFriends(users);
                friends.RemoveAll(x => user.Friends.Select(y => y.Id).Contains(x.Id));
                user.Friends.AddRange(friends);
                db.ReplaceOne(x => x.Id == userId, user);
                success = true;
            }
            return success;
        }

        public bool RemoveFriends(string userId, List<string> ids)
        {
            bool success = false;
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, ids);
            var users = db.Find(filter).ToList();
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                var friends = Bind_UsersToFriends(users);
                user.Friends.RemoveAll(x => friends.Select(y => y.Id).Contains(x.Id));
                db.ReplaceOne(x => x.Id == userId, user);
                success = true;
            }
            return success;
        }

        public List<People> GetFriends(string userId, int pageSize, int pageNumber)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var currentUser = db.Find(x => x.Id == userId).SingleOrDefault();
            if (currentUser != null)
            {
                var list = pageSize == 0 || pageNumber == 0
                    ? currentUser.Friends
                    : currentUser.Friends.Skip((pageNumber - 1) * pageSize).Take(pageSize);
                return list.ToList();
            }
            return null;
        }

        #endregion

        #region followers

        //people who follow me
        public List<People> GetFollowers(string userId, int pageSize, int pageNumber)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var currentUser = db.Find(x => x.Id == userId).SingleOrDefault();
            if (currentUser != null)
            {
                var list = pageSize == 0 || pageNumber == 0
                    ? currentUser.Followers
                    : currentUser.Followers.Skip((pageNumber - 1) * pageSize).Take(pageSize);
                return list.ToList();
            }
            return null;
        }

        //people i follow
        public List<People> GetFollowing(string userId, int pageSize, int pageNumber)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var currentUser = db.Find(x => x.Id == userId).SingleOrDefault();
            if (currentUser != null)
            {
                var list = pageSize == 0 || pageNumber == 0
                    ? currentUser.Following
                    : currentUser.Following.Skip((pageNumber - 1) * pageSize).Take(pageSize);
                return list.ToList();
            }
            return null;
        }

        public bool Follow(string userId, List<string> ids)
        {
            bool success = false;
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, ids);
            var users = db.Find(filter).ToList();
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                List<People> people = Bind_UsersToFriends(users);
                people.RemoveAll(x => user.Friends.Select(y => y.Id).Contains(x.Id));
                user.Following.AddRange(people);
                Task.Run(() =>
                {
                    foreach (var p in people)
                    {
                        AddInFollowers(p.Id, user.Id);
                    }
                });
                db.ReplaceOne(x => x.Id == userId, user);
                success = true;
            }
            return success;
        }

        public bool AddInFollowers(string userId, string newFollower)
        {
            bool success = false;
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);

            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                var userFollowers = db.Find(x => x.Id == newFollower).SingleOrDefault();
                if (userFollowers != null && user.Followers.All(x => x.Id != userFollowers.Id))
                {
                    user.Followers.Add(new People
                    {
                        Email = userFollowers.Email,
                        Firstname = userFollowers.Firstname,
                        Id = userFollowers.Id,
                        Lastname = userFollowers.Lastname,
                        Picture = userFollowers.Picture,
                        Username = userFollowers.Username
                    });
                    db.ReplaceOne(x => x.Id == userId, user);
                    success = true;
                }
            }
            return success;
        }

        public bool Unfollow(string userId, List<string> ids)
        {
            bool success = false;
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, ids);
            var users = db.Find(filter).ToList();
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                var people = Bind_UsersToFriends(users);
                user.Following.RemoveAll(x => people.Select(y => y.Id).Contains(x.Id));
                Task.Run(() =>
                {
                    foreach (var p in people)
                    {
                        RemoveInFollowers(p.Id, user.Id);
                    }
                });
                db.ReplaceOne(x => x.Id == userId, user);
                success = true;
            }
            return success;
        }


        public bool RemoveInFollowers(string userId, string newFollower)
        {
            bool success = false;
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                var userFollowers = user.Followers.SingleOrDefault(x => x.Id == newFollower);
                if (userFollowers != null)
                {
                    user.Followers.Remove(userFollowers);
                    db.ReplaceOne(x => x.Id == userId, user);
                    success = true;
                }
            }
            return success;
        }

        #endregion

        #region Talk

        //public List<Talk> GetTalks(string userId)
        //{
        //    var collection = _db.GetCollection<Talk>(Settings.Default.CollectionTalk);
        //    var query = new FilterDefinitionBuilder<Talk>().In("Users._id", new[] { userId });
        //    var list = collection.Find(query).ToList();
        //    //var list = collection.Find(x => x.Users.Any(y => y.Id == userId)).ToList();
        //    return list;
        //}

        //public bool AddMessageToNewTalk(string idTalk, Message msg)
        //{
        //    var collection = _db.GetCollection<Talk>(Properties.Settings.Default.CollectionTalk);
        //    var talk = new Talk { Id = Guid.NewGuid().ToString(), Messages = new List<Message>(), VocalName = DateTime.Now.ToString("MM-dd-yyyy-HH-mm-ss") };
        //    talk.Messages.Add(msg);
        //    collection.ReplaceOne(x => x.Id == talk.Id, talk);
        //    return true;

        //    return false;
        //}


        //public bool AddMessageToTalk(string idTalk, Message msg)
        //{
        //    var collection = _db.GetCollection<Talk>(Properties.Settings.Default.CollectionTalk);
        //    var talk = collection.Find(x => x.Id == idTalk).SingleOrDefault();
        //    if (talk != null)
        //    {
        //        talk.Messages.Add(msg);
        //        collection.ReplaceOne(x => x.Id == talk.Id, talk);
        //        return true
        //    }
        //    return false;
        //}


        public Talk GetTalk(string idTalk, string userId)
        {
            var fdb = new FilterDefinitionBuilder<Talk>();
            return _db.GetCollection<Talk>(Properties.Settings.Default.CollectionTalk)
                .Find(fdb.Eq(x => x.Id, idTalk) & fdb.In("Users._id", new[] { userId }))
                .SingleOrDefault();
        }

        public List<Talk> GetListTalk(string userId)
        {
            var db = _db.GetCollection<Talk>(Properties.Settings.Default.CollectionTalk);
            var fdb = new FilterDefinitionBuilder<Talk>();
            var list = db.Find(fdb.In("Users._id", new[] { userId }))
                        .Project(x => new Talk { Id = x.Id, VocalName = x.VocalName, Users = x.Users, Messages = x.Messages.OrderByDescending(y => y.SentTime).Take(1).ToList() })
                        .ToList();
            return list;
        }

        public Talk AddTalk(Talk talk)
        {
            talk.Id = Guid.NewGuid().ToString();
            var collection = _db.GetCollection<Talk>(Properties.Settings.Default.CollectionTalk);
            collection.InsertOne(talk);
            return talk;
        }

        public Talk UpdateTalk(Talk talk)
        {
            var collection = _db.GetCollection<Talk>(Properties.Settings.Default.CollectionTalk);
            collection.ReplaceOne(x => x.Id == talk.Id, talk);
            return talk;
        }


        public Talk UptOrCreateTalk(Talk talk)
        {
            return string.IsNullOrEmpty(talk.Id)
                ? this.AddTalk(talk)
                : this.UpdateTalk(talk);
        }

        public List<Message> GetMessages(string talkId)
        {
            var collection = _db.GetCollection<Talk>(Properties.Settings.Default.CollectionTalk);
            var talk = collection.Find(x => x.Id == talkId).SingleOrDefault();
            if (talk != null)
                return talk.Messages;
            else
                return null;
        }

        #endregion




        public T AddToDb<T>(T obj)
        {
            var collection = _db.GetCollection<T>(obj.GetType().Name);
            collection.InsertOne(obj);
            return obj;
        }

        #region Search

        public List<User> SearchPeople(string keyword)
        {
            var list = new List<User>();
            var collection = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            list = collection.Find(x => x.Username.ToLower().Contains(keyword) || 
                                        x.Firstname.ToLower().Contains(keyword) || 
                                        x.Lastname.ToLower().Contains(keyword))
                                        .ToList();
            return list;
        }

        public void AddSearch(Search search)
        {
            var collection = _db.GetCollection<Search>(Properties.Settings.Default.CollectionSearch);
            collection.InsertOne(search);
        }

        #endregion

        #region Monitoring

        public void AddMonitoring(Monitoring obj)
        {
            var collection = _db.GetCollection<Monitoring>(Properties.Settings.Default.CollectionMonitoring);
            collection.InsertOne(obj);
        }

        #endregion


        #region Private methods

        private List<People> Bind_UsersToFriends(List<User> users)
        {
            var list = new List<People>();
            foreach (var item in users)
            {
                list.Add(new People
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
