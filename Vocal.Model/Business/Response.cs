using System;
using System.Collections.Generic;
using System.Text;

namespace Vocal.Model.Business
{
    public class Response<T>
    {
        public T Data { get; set; }
        public string ErrorMessage { get; set; }
        public bool HasError
        {
            get
            {
                return !string.IsNullOrEmpty(ErrorMessage);
            }
        }
    }
}
