using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Model.DB;
using Vocal.Model.Response;

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
                        DateLastMessage = message.Date,
                        HasNewMessage = !message.Users.SingleOrDefault(x => x.UserId == userId).ListenDate.HasValue
                    });
                }
            return response;
        }
    }
}
