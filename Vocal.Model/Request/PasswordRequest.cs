﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Request
{
    public class PasswordRequest : Request
    {
        public string Email { get; set; }
    }
}
