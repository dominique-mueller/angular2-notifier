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
var notifier_global_config_model_1 = require('./../models/notifier-global-config.model');
var notifier_animations_service_1 = require('./../services/notifier-animations.service');
var notifier_notification_component_1 = require('./notifier-notification.component');
var NotifierContainerComponent = (function () {
    function NotifierContainerComponent(notifierGlobalConfig) {
        this.config = notifierGlobalConfig === null ? new notifier_global_config_model_1.NotifierGlobalConfig() : notifierGlobalConfig;
        this.notifications = [];
    }
    NotifierContainerComponent.prototype.addNotification = function (notification) {
        this.notifications.push(notification);
    };
    NotifierContainerComponent.prototype.removeAllNotifications = function () {
        var _this = this;
        if (this.config.animations.enabled && this.config.animations.clear.offset > 0) {
            var _loop_1 = function(i) {
                var animationOffset = this_1.config.position.vertical.position === 'top'
                    ? this_1.config.animations.clear.offset * (this_1.notifications.length - i)
                    : this_1.config.animations.clear.offset * i;
                setTimeout(function () {
                    _this.notifications[i].component.hide().then(function () {
                        if (i === 0) {
                            _this.notifications = [];
                        }
                    });
                }, animationOffset);
            };
            var this_1 = this;
            for (var i = this.notifications.length - 1; i >= 0; i--) {
                _loop_1(i);
            }
        }
        else {
            var animations = [];
            for (var i = this.notifications.length - 1; i >= 0; i--) {
                animations.push(this.notifications[i].component.hide());
            }
            Promise.all(animations).then(function () {
                _this.notifications = [];
            });
        }
    };
    NotifierContainerComponent.prototype.onCreated = function (notificationComponent) {
        var _this = this;
        this.notifications[this.notifications.length - 1].component = notificationComponent;
        if (this.notifications.length > 1) {
            if (this.config.behaviour.stacking === false) {
                this.dismissNotification(this.notifications[0].component).then(function () {
                    notificationComponent.show();
                });
            }
            else {
                if (this.notifications.length > this.config.behaviour.stacking) {
                    this.dismissNotification(this.notifications[0].component);
                    setTimeout(function () {
                        _this.shiftNotifications(_this.notifications.slice(1, _this.notifications.length - 1), notificationComponent.getHeight(), true);
                    }, Math.round(this.config.animations.show.duration / 5));
                    setTimeout(function () {
                        notificationComponent.show();
                    }, Math.round(this.config.animations.show.duration / 2.5));
                }
                else {
                    this.shiftNotifications(this.notifications.slice(0, this.notifications.length - 1), notificationComponent.getHeight(), true);
                    setTimeout(function () {
                        notificationComponent.show();
                    }, Math.round(this.config.animations.show.duration / 5));
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
            }, Math.round(this.config.animations.show.duration / 5));
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
        __metadata('design:paramtypes', [notifier_global_config_model_1.NotifierGlobalConfig])
    ], NotifierContainerComponent);
    return NotifierContainerComponent;
}());
exports.NotifierContainerComponent = NotifierContainerComponent;
