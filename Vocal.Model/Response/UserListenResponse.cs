using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Response
{
    public class UserListenResponse
    {
        public string UserId { get; set; }
        public DateTime? ListenDate { get; set; }
    }
}
