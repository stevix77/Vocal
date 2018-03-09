using System.Collections.Generic;

namespace Vocal.Model.DB
{
    public class Device
    {
        public string Platform { get; set; }
        public string RegistrationId { get; set; }
        public List<string> Tags { get; set; }
        public string Channel { get; set; }
        public string Lang { get; set; }
    }
}
