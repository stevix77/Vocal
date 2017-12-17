using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.Response;

namespace Vocal.Business.Admin
{
    public static class UserManager
    {
        public static Response<List<UserResponse>> GetListUsers()
        {
            var response = new Response<List<UserResponse>>();
            try
            {
                var list = Repository2.Instance.GetAllUsers();
                response.Data = Binder.Bind.Bind_Users(list);
            }
            catch (Exception ex)
            {
                response.ErrorMessage = ex.Message;
            }
            return response;
        }
    }
}
