using System;
using System.Collections.Generic;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.Context;
using Vocal.Model.Response;

namespace Vocal.Business.Admin
{
    public class UserManager : BaseBusiness
    {
        public UserManager(DbContext context) : base(context)
        {
           _repository = Repository.Init(context);
        }

        public Response<List<UserResponse>> GetListUsers()
        {
            var response = new Response<List<UserResponse>>();
            try
            {
                var list = _repository.GetAllUsers();
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
