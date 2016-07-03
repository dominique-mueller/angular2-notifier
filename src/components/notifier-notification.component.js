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
var notifier_notification_model_1 = require('./../models/notifier-notification.model');
var notifier_global_config_model_1 = require('./../models/notifier-global-config.model');
var notifier_animations_service_1 = require('./../services/notifier-animations.service');
var notifier_timer_service_1 = require('./../services/notifier-timer.service');
var NotifierNotificationComponent = (function () {
    function NotifierNotificationComponent(elementRef, renderer, notifierGlobalConfig, notifierAnimationService, notifierTimerService) {
        this.notifierAnimationService = notifierAnimationService;
        this.notifierTimerService = notifierTimerService;
        this.renderer = renderer;
        this.config = notifierGlobalConfig === null ? new notifier_global_config_model_1.NotifierGlobalConfig() : notifierGlobalConfig;
        this.element = elementRef.nativeElement;
        this.created = new core_1.EventEmitter();
        this.dismiss = new core_1.EventEmitter();
        this.currentHeight = 0;
        this.currentShift = 0;
    }
    NotifierNotificationComponent.prototype.ngAfterViewInit = function () {
        this.setup();
        this.currentHeight = this.element.offsetHeight;
        this.created.emit(this);
    };
    NotifierNotificationComponent.prototype.getHeight = function () {
        return this.currentHeight;
    };
    NotifierNotificationComponent.prototype.show = function () {
        if (this.config.animations.enabled) {
            var animationPreset = this.notifierAnimationService.getAnimation(this.config.animations.show.method, 'in');
            for (var key in animationPreset.keyframes[0]) {
                this.renderer.setElementStyle(this.element, key, animationPreset.keyframes[0][key]);
            }
            this.renderer.setElementStyle(this.element, 'visibility', 'visible');
            this.runTimer();
            return this.element.animate(animationPreset.keyframes, animationPreset.options).finished;
        }
        else {
            this.runTimer();
            this.renderer.setElementStyle(this.element, 'visibility', 'visible');
            return new Promise(function (resolve, reject) {
                resolve(null);
            });
        }
    };
    NotifierNotificationComponent.prototype.hide = function () {
        this.stopTimer();
        if (this.config.animations.enabled) {
            var animationPreset = this.notifierAnimationService.getAnimation(this.config.animations.hide.method, 'out');
            return this.element.animate(animationPreset.keyframes, animationPreset.options).finished;
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve(null);
            });
        }
    };
    NotifierNotificationComponent.prototype.shift = function (value, toMakePlace) {
        var newShift;
        switch (this.config.position.vertical.position) {
            case 'top':
                if (toMakePlace) {
                    newShift = this.currentShift + value + this.config.position.gap;
                }
                else {
                    newShift = this.currentShift - value - this.config.position.gap;
                }
                break;
            case 'bottom':
                if (toMakePlace) {
                    newShift = this.currentShift - value - this.config.position.gap;
                }
                else {
                    newShift = this.currentShift + value + this.config.position.gap;
                }
                break;
        }
        var base = this.config.position.horizontal.position === 'middle' ? '-50%' : '0';
        if (this.config.animations.enabled) {
            var animation = this.element.animate([
                {
                    transform: "translate3d( " + base + ", " + this.currentShift + "px, 0 )"
                },
                {
                    transform: "translate3d( " + base + ", " + newShift + "px, 0 )"
                }
            ], {
                delay: 10,
                duration: this.config.animations.shift.duration,
                easing: this.config.animations.shift.easing,
                fill: 'forwards'
            });
            this.currentShift = newShift;
            return animation.finished;
        }
        else {
            this.renderer.setElementStyle(this.element, 'transform', "translate3d( " + base + ", " + newShift + "px, 0 )");
            return new Promise(function (resolve, reject) {
                resolve(null);
            });
        }
    };
    NotifierNotificationComponent.prototype.setup = function () {
        switch (this.config.position.horizontal.position) {
            case 'left':
                this.renderer.setElementStyle(this.element, 'left', this.config.position.horizontal.distance + "px");
                break;
            case 'right':
                this.renderer.setElementStyle(this.element, 'right', this.config.position.horizontal.distance + "px");
                break;
            case 'middle':
                this.renderer.setElementStyle(this.element, 'left', '50%');
                this.renderer.setElementStyle(this.element, 'transform', 'translate3d( -50%, 0, 0 )');
                break;
        }
        switch (this.config.position.vertical.position) {
            case 'top':
                this.renderer.setElementStyle(this.element, 'top', this.config.position.vertical.distance + "px");
                break;
            case 'bottom':
                this.renderer.setElementStyle(this.element, 'bottom', this.config.position.vertical.distance + "px");
                break;
        }
        this.renderer.setElementClass(this.element, 'x-notifier__notification', true);
        this.renderer.setElementClass(this.element, "x-notifier__notification--" + this.notification.type, true);
        this.renderer.setElementClass(this.element, "x-notifier__notification--" + this.config.theme, true);
    };
    NotifierNotificationComponent.prototype.onDismiss = function (target) {
        this.stopTimer();
        this.dismiss.emit(this);
    };
    NotifierNotificationComponent.prototype.onMouseover = function () {
        if (this.config.behaviour.pauseOnMouseover) {
            this.pauseTimer();
        }
        else if (this.config.behaviour.resetOnMouseover) {
            this.stopTimer();
        }
    };
    NotifierNotificationComponent.prototype.onMouseout = function () {
        if (this.config.behaviour.pauseOnMouseover || this.config.behaviour.resetOnMouseover) {
            this.runTimer();
        }
    };
    NotifierNotificationComponent.prototype.runTimer = function () {
        var _this = this;
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.notifierTimerService.run(this.config.behaviour.autoHide, function () {
                _this.dismiss.emit(_this);
            });
        }
    };
    NotifierNotificationComponent.prototype.pauseTimer = function () {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.notifierTimerService.pause();
        }
    };
    NotifierNotificationComponent.prototype.stopTimer = function () {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.notifierTimerService.stop();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', notifier_notification_model_1.NotifierNotification)
    ], NotifierNotificationComponent.prototype, "notification", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NotifierNotificationComponent.prototype, "created", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NotifierNotificationComponent.prototype, "dismiss", void 0);
    NotifierNotificationComponent = __decorate([
        core_1.Component({
            host: {
                '(mouseover)': 'onMouseover()',
                '(mouseout)': 'onMouseout()'
            },
            providers: [
                notifier_timer_service_1.NotifierTimerService
            ],
            selector: 'x-notifier-notification',
            template: "\n\t\t<p class=\"x-notifier__notification-message\">{{ notification.message }}</p>\n\t\t<button class=\"x-notifier__notification-button\" type=\"button\" title=\"dismiss\"\n\t\t\t*ngIf=\"config.behaviour.showDismissButton\" (click)=\"onDismiss()\">\n\t\t\t<svg class=\"x-notifier__notification-dismiss\" viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">\n\t\t\t\t<path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\" />\n\t\t\t</svg>\n\t\t</button>\n\t\t"
        }),
        __param(2, core_1.Optional()), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, notifier_global_config_model_1.NotifierGlobalConfig, notifier_animations_service_1.NotifierAnimationService, notifier_timer_service_1.NotifierTimerService])
    ], NotifierNotificationComponent);
    return NotifierNotificationComponent;
}());
exports.NotifierNotificationComponent = NotifierNotificationComponent;
