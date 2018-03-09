using System;
using System.Collections.Generic;

namespace Vocal.Model.DB
{
    public class Talk
    {
        public string Id { get; set; }
        public string Name { get; set; } = null;
        public List<string> Recipients { get; set; } = new List<string>();
        public int Duration { get; set; }
        public DateTime LastMessage { get; set; }
        public Dictionary<string, bool> ListDelete { get; set; } = new Dictionary<string, bool>();
        public Dictionary<string, bool> ListArchive { get; set; } = new Dictionary<string, bool>();
        public Dictionary<string, string> ListPictures { get; set; } = new Dictionary<string, string>();
        public List<People> Users { get; set; } = new List<People>();
    } 
}
