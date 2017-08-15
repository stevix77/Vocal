using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.DB
{
    public class Device
    {
        public string Platform { get; set; }
        public string RegistrationId { get; set; }
        public List<string> Tags { get; set; }
        public string Channel { get; set; }
    }
}
