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
var NotifierAnimationService = (function () {
    function NotifierAnimationService(notifierGlobalConfig) {
        this.config = notifierGlobalConfig === null ? new notifier_global_config_model_1.NotifierGlobalConfig() : notifierGlobalConfig;
        this.setupAnimationPresets();
    }
    NotifierAnimationService.prototype.getAnimation = function (name, way) {
        var keyframes = this.animationPresets[name][way](this.config);
        var duration = (way === 'in')
            ? this.config.animations.show.duration
            : this.config.animations.hide.duration;
        var easing = (way === 'in')
            ? this.config.animations.show.easing
            : this.config.animations.hide.easing;
        return {
            keyframes: [
                keyframes.from,
                keyframes.to
            ],
            options: {
                delay: 10,
                duration: duration,
                easing: easing,
                fill: 'forwards'
            }
        };
    };
    NotifierAnimationService.prototype.setupAnimationPresets = function () {
        this.animationPresets = {
            fade: {
                in: function (options) {
                    return {
                        from: {
                            opacity: 0
                        },
                        to: {
                            opacity: 1
                        }
                    };
                },
                out: function (options) {
                    return {
                        from: {
                            opacity: 1
                        },
                        to: {
                            opacity: 0
                        }
                    };
                }
            },
            slide: {
                in: function (options) {
                    var animationStart;
                    var animationEnd;
                    switch (options.position.horizontal.position) {
                        case 'left':
                            var leftPosition = "calc( -100% - " + options.position.horizontal.distance + "px - 10px )";
                            animationStart = {
                                transform: "translate3d( " + leftPosition + ", 0, 0 )"
                            };
                            animationEnd = {
                                transform: 'translate3d( 0, 0, 0 )'
                            };
                            break;
                        case 'middle':
                            var middlePosition = void 0;
                            switch (options.position.vertical.position) {
                                case 'top':
                                    middlePosition =
                                        "calc( -100% - " + options.position.horizontal.distance + "px - 10px )";
                                    break;
                                case 'bottom':
                                    middlePosition =
                                        "calc( 100% + " + options.position.horizontal.distance + "px + 10px )";
                                    break;
                            }
                            animationStart = {
                                transform: "translate3d( -50%, " + middlePosition + ", 0 )"
                            };
                            animationEnd = {
                                transform: 'translate3d( -50%, 0, 0 )'
                            };
                            break;
                        case 'right':
                            var rightPosition = "calc( 100% + " + options.position.horizontal.distance + "px + 10px )";
                            animationStart = {
                                transform: "translate3d( " + leftPosition + ", 0, 0 )"
                            };
                            animationEnd = {
                                transform: 'translate3d( 0, 0, 0 )'
                            };
                            break;
                    }
                    return {
                        from: animationStart,
                        to: animationEnd
                    };
                },
                out: function (options) {
                    var animationStart;
                    var animationEnd;
                    switch (options.position.horizontal.position) {
                        case 'left':
                            var leftPosition = "calc( -100% - " + options.position.horizontal.distance + "px - 10px )";
                            animationStart = {
                                transform: 'translate3d( 0, 0, 0 )'
                            };
                            animationEnd = {
                                transform: "translate3d( " + leftPosition + ", 0, 0 )"
                            };
                            break;
                        case 'middle':
                            var middlePosition = void 0;
                            switch (options.position.vertical.position) {
                                case 'top':
                                    middlePosition =
                                        "calc( -100% - " + options.position.horizontal.distance + "px - 10px )";
                                    break;
                                case 'bottom':
                                    middlePosition =
                                        "calc( 100% + " + options.position.horizontal.distance + "px + 10px )";
                                    break;
                            }
                            animationStart = {
                                transform: 'translate3d( -50%, 0, 0 )'
                            };
                            animationEnd = {
                                transform: "translate3d( -50%, " + middlePosition + ", 0 )"
                            };
                            break;
                        case 'right':
                            var rightPosition = "calc( 100% + " + options.position.horizontal.distance + "px + 10px )";
                            animationStart = {
                                transform: 'translate3d( 0, 0, 0 )'
                            };
                            animationEnd = {
                                transform: "translate3d( " + leftPosition + ", 0, 0 )"
                            };
                            break;
                    }
                    return {
                        from: animationStart,
                        to: animationEnd
                    };
                }
            }
        };
    };
    ;
    NotifierAnimationService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [notifier_global_config_model_1.NotifierGlobalConfig])
    ], NotifierAnimationService);
    return NotifierAnimationService;
}());
exports.NotifierAnimationService = NotifierAnimationService;
