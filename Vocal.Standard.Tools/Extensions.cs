using System;

namespace Vocal.Tools
{
    public static class Extensions
    {
        /// <summary>
        /// Récupérer l'attribut StringEnumAttribute d'une valeur d'une enum
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
