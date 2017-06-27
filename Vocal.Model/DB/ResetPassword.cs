using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.DB
{
    public class ResetPassword
    {
        public string Token { get; set; }
        public DateTime ValidityDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
