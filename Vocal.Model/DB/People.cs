using System;
using System.Collections.Generic;

namespace Vocal.Model.DB
{
    public class People
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Picture { get; set; }
        public List<Picture> Pictures { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsFriend { get; set; }
    }
}
