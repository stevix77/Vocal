using System.Collections.Generic;

namespace Vocal.Model.DBO
{
    public class Settings
    {
        public bool IsNotifiable { get; set; } = true;
        public Contacted Contact { get; set; } = Contacted.Everybody;
        public List<People> Blocked { get; set; } = new List<People>();
        public Gender? Gender { get; set; } = null;
    }
}