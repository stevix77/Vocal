using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Request
{
    public class UpdateRequest : Request
    {
        public int UpdateType { get; set; }
        public object Value { get; set; }
    }
}
