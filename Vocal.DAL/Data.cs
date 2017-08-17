using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Model.DB;

namespace Vocal.DAL
{
    public sealed class Data
    {
        public List<People> Users { get; set; } = new List<People>();

        private Data()
        {
            Users.Add(new People { Email = "u1@vocal.fr", Firstname = "fu1", Id = "1", Lastname = "lu1", Username = "uu1" });
            Users.Add(new People { Email = "u2@vocal.fr", Firstname = "fu2", Id = "2", Lastname = "lu2", Username = "uu2" });
            Users.Add(new People { Email = "u3@vocal.fr", Firstname = "fu3", Id = "3", Lastname = "lu3", Username = "uu3" });
            Users.Add(new People { Email = "u4@vocal.fr", Firstname = "fu4", Id = "4", Lastname = "lu4", Username = "uu4" });
            Users.Add(new People { Email = "u5@vocal.fr", Firstname = "fu5", Id = "5", Lastname = "lu5", Username = "uu5" });
            Users.Add(new People { Email = "u6@vocal.fr", Firstname = "fu6", Id = "6", Lastname = "lu6", Username = "uu6" });
            Users.Add(new People { Email = "u7@vocal.fr", Firstname = "fu7", Id = "7", Lastname = "lu7", Username = "uu7" });
            Users.Add(new People { Email = "u8@vocal.fr", Firstname = "fu8", Id = "8", Lastname = "lu8", Username = "uu8" });
        }

        static Data() { }

        private static readonly Data _instance = new Data();
        public static Data Instance
        {
            get
            {
                return _instance;
            }
        }
    }
}
