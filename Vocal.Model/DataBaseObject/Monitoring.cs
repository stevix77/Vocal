using System;
using System.Collections.Generic;

namespace Vocal.Model.DataBaseObject
{
    public class Monitoring
    {
        public string MethodName { get; set; }
        public int Duration { get; set; }
        public List<object> Params { get; set; } = new List<object>();
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
