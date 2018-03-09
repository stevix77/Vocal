using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Request
{
    public class NotificationRegisterRequest : Request
    {
        public string Channel { get; set; }
        public string UserId { get; set; }
        public string Platform { get; set; }
    }
}
