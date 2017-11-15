using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.DAL
{
    public class UpdateModel
    {
        public object Obj { get; set; }
        public string Field { get; set; }
        public UpdateType UpdateType { get; set; }
        public Type Type { get; set; }
    }

    public enum UpdateType
    {
        Field,
        ArrayAdd,
        ArrayRemove
    }
}