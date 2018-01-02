using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Response
{
    public class ChoiceResponse
    {
        public bool IsChecked { get; set; }
        public int Id { get; set; }
        public string Label { get; set; }
    }
}
