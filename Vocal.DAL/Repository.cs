using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using Vocal.Model.DB;
using Vocal.Model.Helpers;

namespace Vocal.DAL
{
    public sealed partial class  Repository
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



        #region Authentification

        public Vocal.Model.DB.User Login(string login, string password)
        {
            var collection = _db.GetCollection<Vocal.Model.DB.User>(Properties.Settings.Default.CollectionUser);
            var user = collection.Find(x => x.Password == password && (x.Email.ToLower() == login || x.Username.ToLower() == login)).SingleOrDefault();
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

        public void AddUser(Vocal.Model.DB.User user)
        {
            var collection = _db.GetCollection<Vocal.Model.DB.User>(Properties.Settings.Default.CollectionUser);
            collection.InsertOne(user);
        }

        public Vocal.Model.DB.User GetUserById(string id)
        {
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Id == id).SingleOrDefault();
            return user;
        }

        public Vocal.Model.DB.User GetUserByEmail(string email)
        {
            var db = _db.GetCollection<Vocal.Model.DB.User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Email.ToLower() == email).SingleOrDefault();
            return user;
        }

        public Vocal.Model.DB.User GetUserByUsername(string username)
        {
            var db = _db.GetCollection<Vocal.Model.DB.User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Username.ToLower() == username).SingleOrDefault();
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

        public List<Vocal.Model.DB.User> GetUsersById(List<string> userIds)
        {
            List<Vocal.Model.DB.User> users = new List<Vocal.Model.DB.User>();
            var db = _db.GetCollection<Vocal.Model.DB.User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<Vocal.Model.DB.User>().In(x => x.Id, userIds);
            users = db.Find(filter).ToList();
            return users;
        }

        public List<Vocal.Model.DB.People> GetUsersByIdInPeole(List<string> userIds)
        {
            var db = _db.GetCollection<Vocal.Model.DB.User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<Vocal.Model.DB.User>().In(x => x.Id, userIds);
            return db.Find(filter)
                     .ToList()
                     .Select(Mapper.ToPeople)
                     .ToList();
        }

        public bool BlockUsers(string userId, List<string> userIds)
        {
            bool success = false;
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if(user != null)
            {
                var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, userIds);
                var users = db.Find(filter).ToList();
                if(users.Count > 0)
                {
                    var list = Bind_UsersToFriends(users);
                    user.Settings.Blocked.AddRange(list);
                    var result = db.ReplaceOne(x => x.Id == userId, user);
                    success = result.ModifiedCount > 0;
                }
            }
            return success;
        }
        
        public bool UnblockUsers(string userId, List<string> userIds)
        {
            bool success = false;
            var db = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                user.Settings.Blocked.RemoveAll(x => userIds.Contains(x.Id));
                var result = db.ReplaceOne(x => x.Id == userId, user);
                success = result.ModifiedCount > 0;
            }
            return success;
        }

        public List<Vocal.Model.DB.User> GetAllUsers()
        {
            var users = new List<Vocal.Model.DB.User>();
            var db = _db.GetCollection<Vocal.Model.DB.User>(Properties.Settings.Default.CollectionUser);
            users = db.AsQueryable().ToList();
            return users;
        }

        #endregion

        #region Friends

        public List<Vocal.Model.DB.User> SearchFriendsByEmails(List<string> emails)
        {
            var users = new List<Vocal.Model.DB.User>();
            var db = _db.GetCollection<Vocal.Model.DB.User>(Properties.Settings.Default.CollectionUser);
            var filter = new FilterDefinitionBuilder<Vocal.Model.DB.User>().In(x => x.Email, emails);
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
                friends.ForEach(x => x.DateAdded = DateTime.Now);
                user.Friends.AddRange(friends);
                Parallel.ForEach(users, (u) =>
                {
                    var friend = db.Find(x => x.Id == u.Id).SingleOrDefault();
                    if(friend != null)
                    {
                        var f = friend.Friends.Find(x => x.Id == userId);
                        if (f != null)
                        {
                            f.IsFriend = true;
                            user.Friends.SingleOrDefault(x => x.Id == u.Id).IsFriend = true;
                            db.ReplaceOne(x => x.Id == u.Id, friend);
                        }
                    }
                });
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
                var friends = Bind_UsersToFriends(users); // traitement pas utile je pense ?
                user.Friends.RemoveAll(x => users.Select(y => y.Id).Contains(x.Id));
                var replace = db.ReplaceOne(x => x.Id == userId, user);
                success = replace.ModifiedCount > 0;
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
                    ? currentUser.Friends.Where(x => !currentUser.Settings.Blocked.Contains(x) && x.IsFriend)
                    : currentUser.Friends.Where(x => !currentUser.Settings.Blocked.Contains(x) && x.IsFriend).Skip((pageNumber - 1) * pageSize).Take(pageSize);
                return list.ToList();
            }
            return null;
        }

        public List<Vocal.Model.DB.User> GetFriendsAddedMe(string userId)
        {
            var db = _db.GetCollection<Vocal.Model.DB.User>(Properties.Settings.Default.CollectionUser);
            var list = db.Find(x => x.Friends.Any(y => y.Id == userId && y.DateAdded > DateTime.Now.AddDays(-7))).ToList();
            return list;
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
                //Task.Run(() =>
                //{
                //    foreach (var p in people)
                //    {
                //        AddInFollowers(p.Id, user.Id);
                //    }
                //});
                Parallel.ForEach(people, (p) => AddInFollowers(p.Id, user.Id));
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
        
        public Message GetMessageById(string messageId, string userId)
        {
            var collection = _db.GetCollection<Message>(Properties.Settings.Default.CollectionMessage);
            var mess = collection.Find(x => x.Id == Guid.Parse(messageId) && x.Users.Any(y => y.Recipient.Id == userId)).SingleOrDefault();
            return mess;
        }
        
        public void AddMessage(Message m)
        {
            var db = _db.GetCollection<Message>(Properties.Settings.Default.CollectionMessage);
            db.InsertOne(m);
        }

        public List<Talk> GetListTalk(string userId)
        {
            var user = GetUserById(userId);
            if (user != null)
            {
                return user.Talks.Where(x => !x.IsArchived && !x.IsDeleted).ToList();
            }
            //must create a proper exception to catch correctly the error 
            throw new Exception("User not found");
        }

        public bool ArchiveTalk(string talkId, string userId)
        {
            var user = GetUserById(userId);
            if (user != null)
            {
                var talk = user.Talks.SingleOrDefault(x => x.Id == talkId);
                talk.IsArchived = true;
                UpdateUser(user);
            }
            throw new Exception("User not found");
        }

        public bool UnArchiveTalk(string talkId, string userId)
        {
            var user = GetUserById(userId);
            if (user != null)
            {
                var talk = user.Talks.SingleOrDefault(x => x.Id == talkId);
                talk.IsArchived = false;
                UpdateUser(user);
            }
            throw new Exception("User not found");
        }

        public bool DeleteTalk(string talkId, string userId)
        {
            var user = GetUserById(userId);
            if (user != null)
            {
                var talk = user.Talks.SingleOrDefault(x => x.Id == talkId);
                talk.IsDeleted = true;
                UpdateUser(user);
            }
            throw new Exception("User not found");
        }

        public bool DeleteMessage(string talkId, List<string> messageIds, string userId)
        {
            var user = GetUserById(userId);
            if (user != null)
            {
                var talk = user.Talks.SingleOrDefault(x => x.Id == talkId);
                var messages = talk.Messages.Where(x => messageIds.Contains(x.Id.ToString()));
                foreach(var m in messages)
                {
                    m.IsDeleted = true;
                }
                UpdateUser(user);
            }
            throw new Exception("User not found");
        }


        public List<Message> GetMessages(string talkId, DateTime? lastMessage, string userId)
        {
            var db = _db.GetCollection<Message>(Properties.Settings.Default.CollectionMessage);
            var find = db.Find(x => x.Talk.Id == talkId && x.Users.Any(y => y.Recipient.Id == userId && !y.IsDeleted) && lastMessage.HasValue ? x.SentTime > lastMessage.Value : true);
            return find.ToList();
        }

        public Talk GetTalk(List<string> users)
        {
            var db = _db.GetCollection<Message>(Properties.Settings.Default.CollectionMessage);
            var mess = db.Find(x => x.Users.Select(y => y.Recipient.Id).All(y => users.Contains(y))).FirstOrDefault();
            if (mess != null)
                return mess.Talk;
            else
                return null;
        }

        public bool SetIsRead(string userId, string talkId, List<Message> messsages)
        {
            foreach(var item in messsages)
            {
                var user = item.Users.SingleOrDefault(x => x.Recipient.Id == userId);
                if(user != null)
                {
                    user.ListenDate = DateTime.Now;
                    UpdateMessage(item);
                }
            }
            return true;
        }

        private bool UpdateMessage(Message item)
        {
            var db = _db.GetCollection<Message>(Properties.Settings.Default.CollectionMessage);
            var req = db.ReplaceOne(x => x.Id == item.Id, item);
            return req.MatchedCount == req.ModifiedCount;
        }

        #endregion




        public T AddToDb<T>(T obj)
        {
            var collection = _db.GetCollection<T>(obj.GetType().Name);
            collection.InsertOne(obj);
            return obj;
        }

        #region Search

        public List<User> SearchPeople(string userId, string keyword)
        {
            var list = new List<User>();
            var collection = _db.GetCollection<User>(Properties.Settings.Default.CollectionUser);
            list = collection.Find(x => (x.Username.ToLower().Contains(keyword) || 
                                        x.Firstname.ToLower().Contains(keyword) || 
                                        x.Lastname.ToLower().Contains(keyword)) &&
                                        x.Id != userId)
                                        .ToList();
            return list;
        }

        public List<Vocal.Model.DB.User> SearchPeopleByEmail(string keyword)
        {
            var list = new List<Vocal.Model.DB.User>();
            var collection = _db.GetCollection<Vocal.Model.DB.User>(Properties.Settings.Default.CollectionUser);
            list = collection.Find(x => x.Email.ToLower().Contains(keyword))
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
