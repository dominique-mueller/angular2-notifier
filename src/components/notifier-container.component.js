"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var notifier_options_global_model_1 = require('./../models/notifier-options-global.model');
var notifier_notification_component_1 = require('./notifier-notification.component');
var notifier_animations_service_1 = require('./../services/notifier-animations.service');
var NotifierContainerComponent = (function () {
    function NotifierContainerComponent(notifierOptions) {
        this.notifications = [];
        this.options = notifierOptions === null ? new notifier_options_global_model_1.NotifierOptions() : notifierOptions;
    }
    NotifierContainerComponent.prototype.addNotification = function (notification) {
        this.notifications.push(notification);
    };
    NotifierContainerComponent.prototype.onCreated = function (notificationComponent) {
        var _this = this;
        this.notifications[this.notifications.length - 1].component = notificationComponent;
        if (this.notifications.length > 1) {
            if (this.options.behaviour.stacking === false) {
                this.dismissNotification(this.notifications[0].component).then(function () {
                    notificationComponent.show();
                });
            }
            else {
                if (this.notifications.length > this.options.behaviour.stacking) {
                    this.dismissNotification(this.notifications[0].component);
                    setTimeout(function () {
                        _this.shiftNotifications(_this.notifications.slice(1, _this.notifications.length - 1), notificationComponent.getHeight(), true);
                    }, Math.round(this.options.animations.show.duration / 5));
                    setTimeout(function () {
                        notificationComponent.show();
                    }, Math.round(this.options.animations.show.duration / 2.5));
                }
                else {
                    this.shiftNotifications(this.notifications.slice(0, this.notifications.length - 1), notificationComponent.getHeight(), true);
                    setTimeout(function () {
                        notificationComponent.show();
                    }, Math.round(this.options.animations.show.duration / 5));
                }
            }
        }
        else {
            notificationComponent.show();
        }
    };
    NotifierContainerComponent.prototype.onDismiss = function (notificationComponent) {
        var _this = this;
        if (this.notifications.length > 1) {
            this.dismissNotification(notificationComponent);
            setTimeout(function () {
                var index = _this.findNotificationIndexByComponent(notificationComponent);
                _this.shiftNotifications(_this.notifications.slice(0, index), notificationComponent.getHeight(), false);
            }, Math.round(this.options.animations.show.duration / 5));
        }
        else {
            this.dismissNotification(notificationComponent);
        }
    };
    NotifierContainerComponent.prototype.dismissNotification = function (notificationComponent) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            notificationComponent.hide().then(function () {
                _this.notifications = _this.notifications.filter(function (currentNotification) {
                    return currentNotification.component !== notificationComponent;
                });
                resolve();
            });
        });
    };
    NotifierContainerComponent.prototype.shiftNotifications = function (notifications, value, toMakePlace) {
        for (var _i = 0, notifications_1 = notifications; _i < notifications_1.length; _i++) {
            var notification = notifications_1[_i];
            notification.component.shift(value, toMakePlace);
        }
    };
    NotifierContainerComponent.prototype.findNotificationIndexByComponent = function (notificationComponent) {
        return this.notifications.findIndex(function (notification) {
            return notification.component === notificationComponent;
        });
    };
    NotifierContainerComponent = __decorate([
        core_1.Component({
            directives: [
                notifier_notification_component_1.NotifierNotificationComponent
            ],
            host: {
                class: 'x-notifier__container'
            },
            providers: [
                notifier_animations_service_1.NotifierAnimationService
            ],
            selector: 'x-notifier-container',
            template: "\n\t\t<ul class=\"x-notifier__container-list\">\n\t\t\t<li *ngFor=\"let notification of notifications\">\n\t\t\t\t<x-notifier-notification\n\t\t\t\t\t[notification]=\"notification\" (created)=\"onCreated( $event )\" (dismiss)=\"onDismiss( $event )\">\n\t\t\t\t</x-notifier-notification>\n\t\t\t</li>\n\t\t</ul>\n\t\t"
        }),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [notifier_options_global_model_1.NotifierOptions])
    ], NotifierContainerComponent);
    return NotifierContainerComponent;
}());
exports.NotifierContainerComponent = NotifierContainerComponent;
