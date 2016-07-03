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
var core_1 = require('@angular/core');
var NotifierOptions = (function () {
    function NotifierOptions(options) {
        if (options === void 0) { options = {
            animations: {
                enabled: true,
                hide: {
                    duration: 300,
                    easing: 'ease',
                    method: 'fade'
                },
                shift: {
                    duration: 300,
                    easing: 'ease'
                },
                show: {
                    duration: 300,
                    easing: 'ease',
                    method: 'slide'
                }
            },
            behaviour: {
                autoHide: 5000,
                pauseOnMouseover: true,
                resetOnMouseover: false,
                showDismissButton: true,
                stacking: 4
            },
            position: {
                gap: 10,
                horizontal: {
                    distance: 12,
                    position: 'left'
                },
                vertical: {
                    distance: 12,
                    position: 'bottom'
                }
            },
            theme: 'material'
        }; }
        Object.assign(this, options);
    }
    NotifierOptions = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object])
    ], NotifierOptions);
    return NotifierOptions;
}());
exports.NotifierOptions = NotifierOptions;
