using System;
using System.Collections.Generic;
using System.Linq;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.Model.DB;
using Vocal.Model.Response;
using Vocal.Tools;

namespace Vocal.Business.Binder
{
    public class Bind
    {
        internal static UserResponse Bind_User(User user)
        {
            if (user == null)
                return null;

            return new UserResponse
            {
                Email = user.Email,
                Id = user.Id,
                Picture = user.Picture,
                Username = user.Username,
                Firstname = user.Firstname,
                Lastname = user.Lastname
            };
        }

        internal static List<UserResponse> Bind_Users(List<User> list)
        {
            var users = new List<UserResponse>();
            foreach(var item in list)
            {
                users.Add(new UserResponse
                {
                    Email = item.Email,
                    Firstname = item.Firstname,
                    Id = item.Id,
                    Lastname = item.Lastname,
                    Picture = item.Picture,
                    Username = item.Username
                });
            }
            return users;
        }

        internal static List<TalkResponse> Bind_Talks(List<Talk> list, string userId)
        {
            var talks = new List<TalkResponse>();
            foreach(var item in list)
            {
                talks.Add(new TalkResponse
                {
                    Id = item.Id,
                    DateLastMessage = item.LastMessage,
                    Users = Bind_Users(item.Users),
                    Duration = item.Duration,
                    Name = item.Recipients.Count == 2 ? string.Join(",", item.Users.Where(x => x.Id != userId).Select(x => x.Username).ToList()) : item.Name,
                    Picture = item.Recipients.Count == 2 ? item.ListPictures.SingleOrDefault(x => x.Key != userId).Value : ""
                });
            }
            return talks;
        }

        internal static List<UserResponse> Bind_People(List<People> list)
        {
            var users = new List<UserResponse>();
            foreach (var item in list)
            {
                users.Add(new UserResponse
                {
                    Email = item.Email,
                    Firstname = item.Firstname,
                    Id = item.Id,
                    Lastname = item.Lastname,
                    Picture = item.Picture,
                    Username = item.Username
                });
            }
            return users;
        }

        internal static UserResponse Bind_People(People people)
        {
            return new UserResponse
            {
                Email = people.Email,
                Firstname = people.Firstname,
                Id = people.Id,
                Lastname = people.Lastname,
                Picture = people.Picture,
                Username = people.Username
            };
        }


        internal static List<UserResponse> Bind_Users(List<People> list)
        {
            var users = new List<UserResponse>();
            foreach (var item in list)
            {
                users.Add(new UserResponse
                {
                    Email = item.Email,
                    Firstname = item.Firstname,
                    Id = item.Id,
                    Lastname = item.Lastname,
                    Picture = item.Picture,
                    Username = item.Username
                });
            }
            return users;
        }

        internal static List<PeopleResponse> Bind_SearchPeople(User user, List<User> listSearch)
        {
            var list = new List<PeopleResponse>();
            foreach(var item in listSearch)
            {
                var friend = user.Friends.Find(x => x.Id == item.Id);
                if (friend == null) // il n'existe pas dans ma liste d'amis
                {
                    list.Add(new PeopleResponse
                    {
                        Email = item.Email,
                        IsFriend = false,
                        Firstname = item.Firstname,
                        Id = item.Id,
                        Lastname = item.Lastname,
                        Picture = item.Picture,
                        Username = item.Username
                    });
                }
                else if(!friend.IsFriend) // s'il est dans ma liste d'amis mais qu'il n'a pas encore accepté ma demande
                    list.Add(new PeopleResponse
                    {
                        Email = item.Email,
                        IsFriend = true,
                        Firstname = item.Firstname,
                        Id = item.Id,
                        Lastname = item.Lastname,
                        Picture = item.Picture,
                        Username = item.Username
                    });
                // sinon c'est qu'il est dans ma liste d'amis et qu'il a accepté ma demande donc ne pas afficher dans le résultat de la recherche
            }
            return list;
        }

        internal static List<PeopleResponse> Bind_People(User user, List<User> lst)
        {
            var list = new List<PeopleResponse>();
            foreach (var item in lst)
            {
                var friend = user.Friends.Find(x => x.Id == item.Id);
                if (friend == null) // il n'existe pas dans ma liste d'amis
                {
                    list.Add(new PeopleResponse
                    {
                        Email = item.Email,
                        IsFriend = false,
                        Firstname = item.Firstname,
                        Id = item.Id,
                        Lastname = item.Lastname,
                        Picture = item.Picture,
                        Username = item.Username
                    });
                }
                else // il existe dans ma liste d'ami et est mon ami
                    list.Add(new PeopleResponse
                    {
                        Email = item.Email,
                        IsFriend = true,
                        Firstname = item.Firstname,
                        Id = item.Id,
                        Lastname = item.Lastname,
                        Picture = item.Picture,
                        Username = item.Username
                    });
            }
            return list;
        }
        

        internal static List<MessageResponse> Bind_Messages(List<Message> list)
        {
            var response = new List<MessageResponse>();
            foreach(var item in list)
            {
                response.Add(new MessageResponse
                {
                    ArrivedTime = item.ArrivedTime,
                    Content = item.ContentType == MessageType.Text ? item.Content : null,
                    ContentType = (int)item.ContentType,
                    Id = item.Id.ToString(),
                    SentTime = item.SentTime,
                    User = Bind_People(item.Sender),
                    Users = Bind_UsersListen(item.Users)
                });
            }
            return response;
        }

        internal static SettingsResponse Bind_UserSettings(User user)
        {
            return new SettingsResponse
            {
                BirthdayDate = user.BirthdayDate,
                Blocked = Bind_People(user.Settings.Blocked),
                Contacts = GetChoices(user.Settings.Contact),
                Email = user.Email,
                Genders = GetChoices(user.Settings.Gender),
                Notifs = GetChoices(user.Settings.IsNotifiable),
                Name = $"{user.Firstname} {user.Lastname} @{user.Username}",
                TotalDuration = 0
            };
        }

        private static List<ChoiceResponse> GetChoices(bool isNotifiable)
        {
            return new List<ChoiceResponse>()
            {
                new ChoiceResponse { Id = 0, IsChecked = isNotifiable == false, Label = Resources_Language.Deactive },
                new ChoiceResponse { Id = 1, IsChecked = isNotifiable == true, Label = Resources_Language.Active }
            };
        }

        internal static MessageResponse Bind_Message(Message m)
        {
           return new MessageResponse
            {
                ArrivedTime = m.ArrivedTime,
                Content = m.Content,
                ContentType = (int)m.ContentType,
                Id = m.Id.ToString(),
                User = Bind_People(m.Sender),
                Users = Bind_UsersListen(m.Users),
                SentTime = m.SentTime
            };
        }

        private static List<UserListenResponse> Bind_UsersListen(List<UserListen> users)
        {
            var response = new List<UserListenResponse>();
            foreach(var item in users)
            {
                response.Add(new UserListenResponse
                {
                    ListenDate = item.ListenDate,
                    UserId = item.Recipient.Id
                });
            }
            return response;
        }

        private static List<ChoiceResponse> GetChoices(Contacted contact)
        {
            var contacts = new List<ChoiceResponse>();
            var names = Enum.GetNames(typeof(Contacted));
            foreach (var item in names)
            {
                var c = (Contacted)Enum.Parse(typeof(Contacted), item);
                contacts.Add(new ChoiceResponse
                {
                    IsChecked = c == contact,
                    Id = (int)c,
                    Label = Resource.GetValue(c.GetStringValue())
                });
            }
            return contacts;
        }

        private static List<ChoiceResponse> GetChoices(Gender? gender)
        {
            var genders = new List<ChoiceResponse>();
            var names = Enum.GetNames(typeof(Gender));
            foreach(var item in names)
            {
                var g = (Gender)Enum.Parse(typeof(Gender), item);
                genders.Add(new ChoiceResponse
                {
                    IsChecked = g == gender,
                    Id = (int)g,
                    Label = Resource.GetValue(g.GetStringValue())
                });
            }
            return genders;
        }

        internal static TalkResponse Bind_Talks(Talk talk, Message message, string userId)
        {
            return new TalkResponse
            {
                DateLastMessage = talk.LastMessage,
                Id = talk.Id,
                Name = !string.IsNullOrEmpty(talk.Name) ? string.Join(",", talk.Users.Where(x => x.Id != userId).Select(x => x.Username).ToList()) : talk.Name,
                Duration = talk.Duration,
                Users = Bind_Users(talk.Users),
                Picture = talk.Users.Count == 2 ? talk.Users.SingleOrDefault(x => x.Id != userId).Pictures.SingleOrDefault(x => x.Type == PictureType.Talk).Value : string.Empty
            };
        }
    }
}
