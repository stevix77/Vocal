using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Request
{
    public class ManageFollowUserRequest : Request
    {
        public List<string> Ids { get; set; }
        public string UserId { get; set; }
    }
}
