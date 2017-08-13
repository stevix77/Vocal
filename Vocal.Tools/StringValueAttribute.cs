using System;

namespace Vocal.Tools
{
    public class StringValueAttribute : Attribute
    {
        public string Value { get; set; }

        public StringValueAttribute(string v)
        {
            this.Value = v;
        }
    }
}