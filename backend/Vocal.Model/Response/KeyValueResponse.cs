using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Response
{
    public class KeyValueResponse<T, K>
    {
        public T Key { get; set; }
        public K Value { get; set; }

        public KeyValueResponse(T key, K value)
        {
            Key = key;
            Value = value;
        }
    }
}
