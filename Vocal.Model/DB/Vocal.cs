using System;
using System.Collections.Generic;
using System.Text;

namespace Vocal.Model.DB
{
    public class Vocal
    {
        public string Id { get; set; }
        public List<User> Users { get; set; } = new List<User>();
        public List<Message> Messages { get; set; } = new List<Message>();
        public string VocalName { get; set; }
    }
}
