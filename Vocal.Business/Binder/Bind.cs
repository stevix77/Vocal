using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
                Username = user.Username
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

        internal static List<TalkResponse> Bind_Talks(List<Talk> list, string userId)
        {
            var response = new List<TalkResponse>();
            if(list.Count > 0)
                foreach(var item in list)
                {
                    var message = item.Messages.LastOrDefault();
                    response.Add(new TalkResponse
                    {
                        Id = item.Id,
                        Name = item.VocalName,
                        Users = Bind_Users(item.Users),
                        DateLastMessage = message.SentTime,
                        HasNewMessage = !message.Users.SingleOrDefault(x => x.UserId == userId).ListenDate.HasValue
                    });
                }
            return response;
        }

        internal static SettingsResponse Bind_UserSettings(User user)
        {
            var settings = new SettingsResponse();
            settings.BirthdayDate = user.BirthdayDate;
            settings.Blocked = Bind_Users(user.Settings.Blocked);
            settings.Contacts = GetChoices(user.Settings.Contact);
            settings.Email = user.Email;
            settings.Genders = GetChoices(user.Settings.Gender);
            settings.Notifs = GetChoices(user.Settings.IsNotifiable);
            settings.Name = $"{user.Firstname} {user.Lastname} @{user.Username}";
            return settings;
        }

        private static List<ChoiceResponse> GetChoices(bool isNotifiable)
        {
            var choices = new List<ChoiceResponse>()
            {
                new ChoiceResponse { Id = 0, IsChecked = isNotifiable == false, Label = Resources_Language.Deactive },
                new ChoiceResponse { Id = 1, IsChecked = isNotifiable == true, Label = Resources_Language.Active }
            };
            return choices;
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
    }
}
