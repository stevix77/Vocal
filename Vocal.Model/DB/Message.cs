using System;
using System.Collections.Generic;
using System.Text;

namespace Vocal.Model.DB
{
    public class Message
    {
        public string Id { get; set; }
        public DateTime Date { get; set; }
        public string File { get; set; }
        public User User { get; set; }
        public List<UserListen> Users { get; set; }
    }
}