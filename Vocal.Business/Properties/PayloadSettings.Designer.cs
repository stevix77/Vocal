﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Vocal.Business.Properties {
    
    
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.VisualStudio.Editors.SettingsDesigner.SettingsSingleFileGenerator", "15.5.0.0")]
    internal sealed partial class PayloadSettings : global::System.Configuration.ApplicationSettingsBase {
        
        private static PayloadSettings defaultInstance = ((PayloadSettings)(global::System.Configuration.ApplicationSettingsBase.Synchronized(new PayloadSettings())));
        
        public static PayloadSettings Default {
            get {
                return defaultInstance;
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("<toast launch=\"talkId={2}&action={3}\"><visual><binding template =\"ToastText02\"><t" +
            "ext id=\"1\">{1}</text><text id=\"2\">{0}</text></binding></visual></toast>")]
        public string TalkWindows {
            get {
                return ((string)(this["TalkWindows"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("")]
        public string FollowAndroid {
            get {
                return ((string)(this["FollowAndroid"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("")]
        public string FollowiOs {
            get {
                return ((string)(this["FollowiOs"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("")]
        public string FollowWindows {
            get {
                return ((string)(this["FollowWindows"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("{{\"data\" : {{\"message\" : \"{0}\",  \"userId\": \"{1}\", \"action\": \"{2}\" }}}}")]
        public string AddFriendsAndroid {
            get {
                return ((string)(this["AddFriendsAndroid"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("{{\"aps\" : {{\"alert\": \"{0}\",  \"userId\" : \"{1}\", \"action\": \"{2}\" }}}}")]
        public string AddFriendsiOs {
            get {
                return ((string)(this["AddFriendsiOs"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("<toast launch=\"userId={1}&action={2}\"><visual><binding template =\"ToastText01\"><t" +
            "ext id=\"2\">{0}</text></binding></visual></toast>")]
        public string AddFriendsWindows {
            get {
                return ((string)(this["AddFriendsWindows"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("{{\"data\" : {{\"message\" : \"{0}\", \"title\" : \"{1}\", \"talkId\" : \"{2}\", \"action\": \"{3}" +
            "\" }}}}")]
        public string TalkAndroid {
            get {
                return ((string)(this["TalkAndroid"]));
            }
        }
        
        [global::System.Configuration.ApplicationScopedSettingAttribute()]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [global::System.Configuration.DefaultSettingValueAttribute("{{\"aps\" : {{\"alert\" : \"{0}\", \"title\" : \"{1}\", \"talkId\" : \"{2}\", \"action\": \"{3}\" }" +
            "}}}")]
        public string TalkiOs {
            get {
                return ((string)(this["TalkiOs"]));
            }
        }
    }
}
