using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.DAL;
using Vocal.Model.DB;

namespace Vocal.Console
{
    class Program
    {
        static void Main(string[] args)
        {
            System.Console.WriteLine(UpdateUsers());
        }

        private static bool UpdateUsers()
        {
            bool success = false;
            var users = Repository.Instance.GetAllUsers();
            if(users.Any())
            {
                foreach(var item in users)
                {
                    //item.Talks = new List<Talk>();
                    Repository.Instance.UpdateUser(item);
                }
                success = true;
            }
            return success;
        }
    }
}
