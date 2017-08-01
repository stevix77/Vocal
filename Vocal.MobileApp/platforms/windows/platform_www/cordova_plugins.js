cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-console.logger",
        "file": "plugins/cordova-plugin-console/www/logger.js",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "cordova.logger"
        ]
    },
    {
        "id": "cordova-plugin-console.console",
        "file": "plugins/cordova-plugin-console/www/console-via-logger.js",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "console"
        ]
    },
    {
        "id": "cordova-plugin-contacts.contacts",
        "file": "plugins/cordova-plugin-contacts/www/contacts.js",
        "pluginId": "cordova-plugin-contacts",
        "clobbers": [
            "navigator.contacts"
        ]
    },
    {
        "id": "cordova-plugin-contacts.Contact",
        "file": "plugins/cordova-plugin-contacts/www/Contact.js",
        "pluginId": "cordova-plugin-contacts",
        "clobbers": [
            "Contact"
        ]
    },
    {
        "id": "cordova-plugin-contacts.convertUtils",
        "file": "plugins/cordova-plugin-contacts/www/convertUtils.js",
        "pluginId": "cordova-plugin-contacts"
    },
    {
        "id": "cordova-plugin-contacts.ContactAddress",
        "file": "plugins/cordova-plugin-contacts/www/ContactAddress.js",
        "pluginId": "cordova-plugin-contacts",
        "clobbers": [
            "ContactAddress"
        ]
    },
    {
        "id": "cordova-plugin-contacts.ContactError",
        "file": "plugins/cordova-plugin-contacts/www/ContactError.js",
        "pluginId": "cordova-plugin-contacts",
        "clobbers": [
            "ContactError"
        ]
    },
    {
        "id": "cordova-plugin-contacts.ContactField",
        "file": "plugins/cordova-plugin-contacts/www/ContactField.js",
        "pluginId": "cordova-plugin-contacts",
        "clobbers": [
            "ContactField"
        ]
    },
    {
        "id": "cordova-plugin-contacts.ContactFindOptions",
        "file": "plugins/cordova-plugin-contacts/www/ContactFindOptions.js",
        "pluginId": "cordova-plugin-contacts",
        "clobbers": [
            "ContactFindOptions"
        ]
    },
    {
        "id": "cordova-plugin-contacts.ContactName",
        "file": "plugins/cordova-plugin-contacts/www/ContactName.js",
        "pluginId": "cordova-plugin-contacts",
        "clobbers": [
            "ContactName"
        ]
    },
    {
        "id": "cordova-plugin-contacts.ContactOrganization",
        "file": "plugins/cordova-plugin-contacts/www/ContactOrganization.js",
        "pluginId": "cordova-plugin-contacts",
        "clobbers": [
            "ContactOrganization"
        ]
    },
    {
        "id": "cordova-plugin-contacts.ContactFieldType",
        "file": "plugins/cordova-plugin-contacts/www/ContactFieldType.js",
        "pluginId": "cordova-plugin-contacts",
        "merges": [
            ""
        ]
    },
    {
        "id": "cordova-plugin-contacts.ContactProxy",
        "file": "plugins/cordova-plugin-contacts/src/windows/ContactProxy.js",
        "pluginId": "cordova-plugin-contacts",
        "runs": true
    },
    {
        "id": "cordova-plugin-datepicker.DatePicker",
        "file": "plugins/cordova-plugin-datepicker/www/windows/DatePicker.js",
        "pluginId": "cordova-plugin-datepicker",
        "clobbers": [
            "datePicker"
        ]
    },
    {
        "id": "cordova-plugin-datepicker.DatePickerProxy",
        "file": "plugins/cordova-plugin-datepicker/src/windows/DatePickerProxy.js",
        "pluginId": "cordova-plugin-datepicker",
        "merges": [
            ""
        ]
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "cordova-plugin-device.DeviceProxy",
        "file": "plugins/cordova-plugin-device/src/windows/DeviceProxy.js",
        "pluginId": "cordova-plugin-device",
        "merges": [
            ""
        ]
    },
    {
        "id": "cordova-plugin-globalization.GlobalizationError",
        "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
        "pluginId": "cordova-plugin-globalization",
        "clobbers": [
            "window.GlobalizationError"
        ]
    },
    {
        "id": "cordova-plugin-globalization.globalization",
        "file": "plugins/cordova-plugin-globalization/www/globalization.js",
        "pluginId": "cordova-plugin-globalization",
        "clobbers": [
            "navigator.globalization"
        ]
    },
    {
        "id": "cordova-plugin-globalization.GlobalizationProxy",
        "file": "plugins/cordova-plugin-globalization/src/windows/GlobalizationProxy.js",
        "pluginId": "cordova-plugin-globalization",
        "runs": true
    },
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-inappbrowser.InAppBrowserProxy",
        "file": "plugins/cordova-plugin-inappbrowser/src/windows/InAppBrowserProxy.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "merges": [
            ""
        ]
    },
    {
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "pluginId": "cordova-sqlite-storage",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "id": "cordova-sqlite-storage.SQLiteProxy",
        "file": "plugins/cordova-sqlite-storage/src/windows/sqlite-proxy.js",
        "pluginId": "cordova-sqlite-storage",
        "merges": [
            ""
        ]
    },
    {
        "id": "cordova-sqlite-storage.SQLite3",
        "file": "plugins/cordova-sqlite-storage/src/windows/SQLite3-Win-RT/SQLite3JS/js/SQLite3.js",
        "pluginId": "cordova-sqlite-storage",
        "merges": [
            ""
        ]
    },
    {
        "id": "cordova-plugin-ms-azure-mobile-apps.AzureMobileServices.Ext",
        "file": "plugins/cordova-plugin-ms-azure-mobile-apps/www/MobileServices.Cordova.Ext.js",
        "pluginId": "cordova-plugin-ms-azure-mobile-apps",
        "runs": true
    },
    {
        "id": "cordova-plugin-ms-azure-mobile-apps.AzureMobileServices",
        "file": "plugins/cordova-plugin-ms-azure-mobile-apps/www/MobileServices.Cordova.js",
        "pluginId": "cordova-plugin-ms-azure-mobile-apps",
        "clobbers": [
            "WindowsAzure"
        ]
    },
    {
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "id": "cordova-plugin-splashscreen.SplashScreenProxy",
        "file": "plugins/cordova-plugin-splashscreen/www/windows/SplashScreenProxy.js",
        "pluginId": "cordova-plugin-splashscreen",
        "runs": true
    },
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "id": "cordova-plugin-statusbar.StatusBarProxy",
        "file": "plugins/cordova-plugin-statusbar/src/windows/StatusBarProxy.js",
        "pluginId": "cordova-plugin-statusbar",
        "runs": true
    },
    {
        "id": "ionic-plugin-keyboard.KeyboardProxy",
        "file": "plugins/ionic-plugin-keyboard/src/windows/KeyboardProxy.js",
        "pluginId": "ionic-plugin-keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "id": "phonegap-plugin-push.PushNotification",
        "file": "plugins/phonegap-plugin-push/www/push.js",
        "pluginId": "phonegap-plugin-push",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "id": "phonegap-plugin-push.PushPlugin",
        "file": "plugins/phonegap-plugin-push/src/windows/PushPluginProxy.js",
        "pluginId": "phonegap-plugin-push",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-console": "1.0.5",
    "cordova-plugin-contacts": "2.3.1",
    "cordova-plugin-datepicker": "0.9.3",
    "cordova-plugin-device": "1.1.4",
    "cordova-plugin-globalization": "1.0.7",
    "cordova-plugin-inappbrowser": "1.5.0",
    "cordova-sqlite-storage": "1.4.8",
    "cordova-plugin-ms-azure-mobile-apps": "2.0.0",
    "cordova-plugin-splashscreen": "4.0.3",
    "cordova-plugin-statusbar": "2.2.2",
    "cordova-plugin-whitelist": "1.3.1",
    "ionic-plugin-keyboard": "2.2.1",
    "phonegap-plugin-push": "2.0.0-rc5"
};
// BOTTOM OF METADATA
});