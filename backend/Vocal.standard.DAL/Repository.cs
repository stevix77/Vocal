using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocal.Model.Context;
using Vocal.Model.DB;
using Vocal.Model.Helpers;
using Vocal.Model.Request;

namespace Vocal.DAL
{
    public sealed partial class Repository
    {

        static DbContext _config;
        static Repository _instance;
        MongoClient _client;
        IMongoDatabase _db;

        Repository()
        {
            MongoDB.Bson.Serialization.BsonClassMap.RegisterClassMap<SendMessageRequest>();
            MongoDB.Bson.Serialization.BsonClassMap.RegisterClassMap<DeleteMessageRequest>();
            MongoDB.Bson.Serialization.BsonClassMap.RegisterClassMap<UpdateTalkRequest>();
            _client = GetClient();
            _db = GetDatabase();
        }


        public static Repository Init(DbContext config)
        {
            if (_instance != null)
            {
                return _instance;
            }
            _config = config;
            _instance = new Repository();
            return _instance;
        }


        IMongoDatabase GetDatabase()
        {
            return _client.GetDatabase(_config.DocumentDBName);
        }

        MongoClient GetClient()
        {
            var settings = new MongoClientSettings
            {
                Server = new MongoServerAddress(_config.Host, _config.Port)
            };
            var identity = new MongoInternalIdentity(_config.DocumentDBName, _config.DocumentDBUser);
            var evidence = new PasswordEvidence(_config.DocumentDBPwd);
            var client = new MongoClient(settings);
            return client;
        }

        #region transfert data

        public void InsertNewUsers(List<User> users)
        {
            var db = _db.GetCollection<User>(_config.CollectionUser);
            db.InsertMany(users);
        }

        public void InsertNewTalks(List<Talk> talks)
        {
            var db = _db.GetCollection<Talk>(_config.CollectionTalk);
            db.InsertMany(talks);
        }

        public void InsertNewMessages(List<Message> messages)
        {
            var db = _db.GetCollection<Message>(_config.CollectionMessage);
            db.InsertMany(messages);
        }
        #endregion

        #region Authentification

        public User Login(string login, string password)
        {
            var collection = _db.GetCollection<User>(_config.CollectionUser);
            var user = collection.Find(x => x.Password == password && (x.Email.ToLower() == login || x.Username.ToLower() == login)).SingleOrDefault();
            return user;
        }

        public void SaveSign(string userId, string sign)
        {
            var collection = _db.GetCollection<User>(_config.CollectionUser);
            var user = collection.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                user.Signs.Add(sign);
                collection.ReplaceOne(x => x.Id == userId, user);
            }
        }

        public bool GetSignature(string sign)
        {
            var collection = _db.GetCollection<User>(_config.CollectionUser);
            return collection.Find(x => x.Signs.Contains(sign)).Any();
        }

        #endregion

        #region User 

        public void AddUser(User user)
        {
            var collection = _db.GetCollection<User>(_config.CollectionUser);
            collection.InsertOne(user);
        }

        public User GetUserById(string id)
        {
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var user = db.Find(x => x.Id == id).SingleOrDefault();
            return user;
        }

        public User GetUserByEmail(string email)
        {
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var user = db.Find(x => x.Email.ToLower() == email).SingleOrDefault();
            return user;
        }

        public User GetUserByUsername(string username)
        {
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var user = db.Find(x => x.Username.ToLower() == username.ToLower()).SingleOrDefault();
            return user;
        }

        public void UpdateUser(User user)
        {
            var db = _db.GetCollection<User>(_config.CollectionUser);
            db.ReplaceOne(x => x.Id == user.Id, user);
        }

        public bool CheckIfAllUsersExist(List<string> userIds)
        {
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, userIds);
            return db.Count(filter) == userIds.Count;
        }

        public List<User> GetUsersById(List<string> userIds)
        {
            var users = new List<User>();
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, userIds);
            users = db.Find(filter).ToList();
            return users;
        }

        public List<People> GetUsersByIdInPeole(List<string> userIds)
        {
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, userIds);
            return db.Find(filter)
                     .ToList()
                     .Select(Mapper.ToPeople)
                     .ToList();
        }

        public bool BlockUsers(string userId, List<string> userIds)
        {
            bool success = false;
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, userIds);
                var users = db.Find(filter).ToList();
                if (users.Count > 0)
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
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var user = db.Find(x => x.Id == userId).SingleOrDefault();
            if (user != null)
            {
                user.Settings.Blocked.RemoveAll(x => userIds.Contains(x.Id));
                var result = db.ReplaceOne(x => x.Id == userId, user);
                success = result.ModifiedCount > 0;
            }
            return success;
        }

        public List<User> GetAllUsers()
        {
            var users = new List<User>();
            var db = _db.GetCollection<User>(_config.CollectionUser);
            users = db.AsQueryable().ToList();
            return users;
        }

        #endregion

        #region Friends

        public List<User> SearchFriendsByEmails(List<string> emails)
        {
            var users = new List<User>();
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Email, emails);
            users = db.Find(filter).ToList();
            return users;
        }

        public List<User> SearchFriendsByIds(List<string> ids)
        {
            List<User> users = new List<User>();
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var filter = new FilterDefinitionBuilder<User>().In(x => x.Id, ids);
            users = db.Find(filter).ToList();
            return users;
        }

        public bool AddFriends(string userId, List<string> ids)
        {
            bool success = false;
            var db = _db.GetCollection<User>(_config.CollectionUser);
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
                    if (friend != null)
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
            var db = _db.GetCollection<User>(_config.CollectionUser);
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
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var currentUser = db.Find(x => x.Id == userId).SingleOrDefault();
            if (currentUser != null)
            {
                var list = pageSize == 0 || pageNumber == 0
                    ? currentUser.Friends.Where(x => !currentUser.Settings.Blocked.Contains(x))
                    : currentUser.Friends.Where(x => !currentUser.Settings.Blocked.Contains(x)).Skip((pageNumber - 1) * pageSize).Take(pageSize);
                return list.ToList();
            }
            return null;
        }

        public List<User> GetFriendsAddedMe(string userId)
        {
            var db = _db.GetCollection<User>(_config.CollectionUser);
            var list = db.Find(x => x.Friends.Any(y => y.Id == userId && y.DateAdded > DateTime.Now.AddDays(-7))).ToList();
            return list;
        }


        #endregion

        #region followers

        //people who follow me
        public List<People> GetFollowers(string userId, int pageSize, int pageNumber)
        {
            var db = _db.GetCollection<User>(_config.CollectionUser);
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

        public void UpdateTalk(Talk talk)
        {
            var db = _db.GetCollection<Talk>(_config.CollectionTalk);
            var req = db.ReplaceOne(x => x.Id == talk.Id, talk);
        }

        //people i follow
        public List<People> GetFollowing(string userId, int pageSize, int pageNumber)
        {
            var db = _db.GetCollection<User>(_config.CollectionUser);
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
            var db = _db.GetCollection<User>(_config.CollectionUser);
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
            var db = _db.GetCollection<User>(_config.CollectionUser);

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
            var db = _db.GetCollection<User>(_config.CollectionUser);
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
            var db = _db.GetCollection<User>(_config.CollectionUser);
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
            var collection = _db.GetCollection<Message>(_config.CollectionMessage);
            var mess = collection.Find(x => x.Id == Guid.Parse(messageId) && x.Users.Any(y => y.Recipient.Id == userId)).SingleOrDefault();
            return mess;
        }

        public void AddMessage(Message m)
        {
            var db = _db.GetCollection<Message>(_config.CollectionMessage);
            db.InsertOne(m);
        }

        public List<Talk> GetListTalk(string userId)
        {
            var db = _db.GetCollection<Talk>(_config.CollectionTalk);
            var list = db.Aggregate()
                          .Match(x => x.Recipients.Any(y => y == userId) && !x.ListArchive[userId] && !x.ListDelete[userId])
                          .SortByDescending(x => x.LastMessage).ToList();
            return list;
        }

        public bool ArchiveTalk(string talkId, string userId)
        {
            var talk = GetTalkById(talkId);
            if (talk != null)
            {
                talk.ListArchive[userId] = true;
                UpdateTalk(talk);
                return true;
            }
            return false;
        }

        private Message GetLastMessage(string talkId, string userId)
        {
            var db = _db.GetCollection<Message>(_config.CollectionMessage);
            return db.Find(x => x.TalkId == talkId).SortByDescending(x => x.ArrivedTime).FirstOrDefault();
        }

        public bool UnArchiveTalk(string talkId, string userId)
        {
            var talk = GetTalkById(talkId);
            if (talk != null)
            {
                talk.ListArchive[userId] = false;
                UpdateTalk(talk);
                return true;
            }
            return false;
        }

        public bool DeleteTalk(string talkId, string userId)
        {
            var talk = GetTalkById(talkId);
            if (talk != null)
            {
                talk.ListDelete[userId] = true;
                UpdateTalk(talk);
                return true;
            }
            return false;
        }

        public Talk GetTalkById(string talkId)
        {
            var db = _db.GetCollection<Talk>(_config.CollectionTalk);
            return db.Find(x => x.Id == talkId).SingleOrDefault();
        }

        public bool DeleteMessage(List<string> messageIds, string userId)
        {
            var count = 0;
            if (messageIds == null || messageIds.Count == 0)
                return false;
            foreach (var item in messageIds)
            {
                var mess = GetMessageById(item, userId);
                if (mess != null)
                {
                    mess.Users.SingleOrDefault(x => x.Recipient.Id == userId).IsDeleted = true;
                    count += UpdateMessage(mess) ? 1 : 0;
                }
            }
            return count == messageIds.Count;
        }


        public List<Message> GetMessages(string talkId, DateTime? lastMessage, string userId)
        {
            var db = _db.GetCollection<Message>(_config.CollectionMessage);
            if (lastMessage.HasValue)
                return db.Find(x => x.TalkId == talkId && x.ArrivedTime > lastMessage.Value && x.Users.Any(y => y.Recipient.Id == userId && !y.IsArchived && !y.IsDeleted)).ToList();
            else
                return db.Find(x => x.TalkId == talkId && x.Users.Any(y => y.Recipient.Id == userId && !y.IsArchived && !y.IsDeleted)).ToList();
        }

        public Talk GetTalk(List<string> users)
        {
            var db = _db.GetCollection<Talk>(_config.CollectionTalk);
            var query = db.Aggregate().Match(Builders<Talk>.Filter.All("Recipients", users)).SingleOrDefault();
            //var query = db.Find(filter).SingleOrDefault();
            //var mess = db.Find(x => users.All(y => x.Users.Select(z => z.Recipient.Id).ToList().Contains(y))).ToList();
            if (query != null)
                return query;
            else
                return null;
        }

        public void AddTalk(Talk talk)
        {
            var db = _db.GetCollection<Talk>(_config.CollectionTalk);
            db.InsertOne(talk);
        }

        public bool SetIsRead(string userId, string talkId, List<Message> messsages)
        {
            foreach (var item in messsages)
            {
                var user = item.Users.SingleOrDefault(x => x.Recipient.Id == userId);
                if (user != null)
                {
                    user.ListenDate = DateTime.Now;
                    UpdateMessage(item);
                }
            }
            return true;
        }

        private bool UpdateMessage(Message item)
        {
            var db = _db.GetCollection<Message>(_config.CollectionMessage);
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
            var collection = _db.GetCollection<User>(_config.CollectionUser);
            list = collection.Find(x => (x.Username.ToLower().Contains(keyword) ||
                                        x.Firstname.ToLower().Contains(keyword) ||
                                        x.Lastname.ToLower().Contains(keyword)) &&
                                        x.Id != userId && x.Settings.Contact != Contacted.Nobody)
                                        .ToList();
            return list;
        }

        public List<User> SearchPeopleByEmail(string keyword)
        {
            var list = new List<User>();
            var collection = _db.GetCollection<User>(_config.CollectionUser);
            list = collection.Find(x => x.Email.ToLower().Contains(keyword))
                                        .ToList();
            return list;
        }

        public void AddSearch(Search search)
        {
            var collection = _db.GetCollection<Search>(_config.CollectionSearch);
            collection.InsertOne(search);
        }

        #endregion

        #region Monitoring

        public void AddMonitoring(Monitoring obj)
        {
            var collection = _db.GetCollection<Monitoring>(_config.CollectionMonitoring);
            collection.InsertOne(obj);
        }

        #endregion

        #region Backup

        public List<BsonDocument> GetAllCollections()
        {
            var collections = _db.ListCollections().ToList();
            return collections;
        }

        public List<object> GetDocuments(string collectionName)
        {
            var data = _db.GetCollection<object>(collectionName);
            return data.Find(x => true).ToList();
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