using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Tools
{
    public static class Extensions
    {
        /// <summary>
        /// R�cup�rer l'attribut StringEnumAttribute d'une valeur d'une enum
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public static string GetStringValue(this Enum e)
        {
            var value = string.Empty;
            var a = Attribute.GetCustomAttribute(e.GetType().GetField(e.ToString()), typeof(StringValueAttribute)) as StringValueAttribute;
            if (a != null)
            {
                if (!string.IsNullOrEmpty(a.Value))
                    value = a.Value;
                else
                    value = e.ToString();
            }
            else
                value = e.ToString();
            return value;
        }
    }
}
