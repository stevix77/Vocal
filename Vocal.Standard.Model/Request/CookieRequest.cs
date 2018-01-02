using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Request
{
    public class CookieRequest
    {
        public string UserId { get; set; }
        public string Sign { get; set; }
        public string Timestamp { get; set; }
    }
}
