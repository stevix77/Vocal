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
    }
}
