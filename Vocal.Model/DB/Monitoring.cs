using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.DB
{
    public class Monitoring
    {
        public string MethodName { get; set; }
        public int Duration { get; set; }
        public List<object> Params { get; set; } = new List<object>();
    }
}
