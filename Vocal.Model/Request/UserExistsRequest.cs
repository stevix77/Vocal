using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Request
{
    public class UserExistsRequest : Request
    {
        public string Value { get; set; }
    }
}
