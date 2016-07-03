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
var view_container_ref_1 = require('@angular/core/src/linker/view_container_ref');
var notifier_notification_model_1 = require('./../models/notifier-notification.model');
var notifier_options_global_model_1 = require('./../models/notifier-options-global.model');
var notifier_container_component_1 = require('./../components/notifier-container.component');
var NotifierService = (function () {
    function NotifierService(applicationRef, componentResolver, notifierOptions) {
        var _this = this;
        console.log('### NOTIFIER OPTIONS');
        console.log(notifierOptions);
        applicationRef.registerBootstrapListener(function (rootComponentRef) {
            var rootComponent = new view_container_ref_1.ViewContainerRef_(rootComponentRef['_hostElement']);
            componentResolver
                .resolveComponent(notifier_container_component_1.NotifierContainerComponent)
                .then(function (componentFactory) {
                _this.notifierContainer = rootComponent.createComponent(componentFactory, rootComponent.length, rootComponent.parentInjector).instance;
            });
        });
    }
    NotifierService.prototype.notify = function (type, message, options) {
        this.notifierContainer.addNotification(new notifier_notification_model_1.NotifierNotification(type, message));
    };
    NotifierService = __decorate([
        core_1.Injectable(),
        __param(2, core_1.Optional()), 
        __metadata('design:paramtypes', [core_1.ApplicationRef, core_1.ComponentResolver, notifier_options_global_model_1.NotifierOptions])
    ], NotifierService);
    return NotifierService;
}());
exports.NotifierService = NotifierService;
