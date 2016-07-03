"use strict";
var NotifierNotification = (function () {
    function NotifierNotification(type, message) {
        this.type = type;
        this.message = message;
        this.component = null;
    }
    return NotifierNotification;
}());
exports.NotifierNotification = NotifierNotification;
