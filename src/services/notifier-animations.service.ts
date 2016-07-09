/**
 * External imports
 */
import { Injectable } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierAnimation } from './../models/notifier-animation.model';
import { NotifierAnimationPreset } from './../models/notifier-animation-preset.model';
import { NotifierNotificationComponent } from './../components/notifier-notification.component';

/**
 * Notifier animation service
 * This service provides all animation presets
 */
@Injectable()
export class NotifierAnimationService {

	/**
	 * List of all animation presets, each with one name and both directions ('in' and 'out')
	 */
	private animationPresets: {
		[ name: string ]: {
			[ way: string ]: ( component: NotifierNotificationComponent ) => NotifierAnimationPreset
		};
	};

	/**
	 * Constructor
	 */
	public constructor() {
		this.setupAnimationPresets();
	}

	/**
	 * Get animation preset, result follows the Web Animations API syntax
	 * @param  {string}                        name      Animation method name
	 * @param  {string}                        way       Animation way, either 'in' or 'out'
	 * @param  {NotifierNotificationComponent} component Notifier notification component
	 * @return {NotifierAnimation}                       Notifier animation preset
	 */
	public getAnimation( name: string, way: string, component: NotifierNotificationComponent ): NotifierAnimation {

		// Get all necessary animation values
		const keyframes: NotifierAnimationPreset = this.animationPresets[ name ][ way ]( component );
		const duration: number = ( way === 'in' )
			? component.getConfig().animations.show.duration
			: component.getConfig().animations.hide.duration;
		const easing: string = ( way === 'in' )
			? component.getConfig().animations.show.easing
			: component.getConfig().animations.hide.easing;

		// Build animation
		return {
			keyframes: [
				keyframes.from,
				keyframes.to
			],
			options: {
				delay: 10, // Give the browser some lunch time ...
				duration: duration, // Time in ms
				easing: easing,
				fill: 'forwards' // Keep the new state after the animation finished
			}
		};

	}

	/**
	 * Initial setup, adding all default animation presets to the service
	 */
	private setupAnimationPresets(): void {
		this.animationPresets = {

			fade: {
				in: ( component: NotifierNotificationComponent ): NotifierAnimationPreset => {
					return {
						from: {
							opacity: 0
						},
						to: {
							opacity: 1
						}
					};
				},
				out: ( component: NotifierNotificationComponent ): NotifierAnimationPreset => {
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
				in: ( component: NotifierNotificationComponent ): NotifierAnimationPreset => {
					let animationStart: Object;
					let animationEnd: Object;
					switch ( component.getConfig().position.horizontal.position ) {
						case 'left':
							let leftPosition: string = `calc( -100% - ${ component.getConfig().position.horizontal.distance }px - 10px )`;
							animationStart = {
								transform: `translate3d( ${ leftPosition }, 0, 0 )`
							};
							animationEnd = {
								transform: 'translate3d( 0, 0, 0 )'
							};
							break;
						case 'middle':
							let middlePosition: string;
							switch ( component.getConfig().position.vertical.position ) {
								case 'top':
									middlePosition = `calc( -100% - ${ component.getConfig().position.horizontal.distance }px - 10px )`;
									break;
								case 'bottom':
									middlePosition = `calc( 100% + ${ component.getConfig().position.horizontal.distance }px + 10px )`;
									break;
							}
							animationStart = {
								transform: `translate3d( -50%, ${ middlePosition }, 0 )`
							};
							animationEnd = {
								transform: 'translate3d( -50%, 0, 0 )'
							};
							break;
						case 'right':
							let rightPosition: string = `calc( 100% + ${ component.getConfig().position.horizontal.distance }px + 10px )`;
							animationStart = {
								transform: `translate3d( ${ rightPosition }, 0, 0 )`
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
				out: ( component: NotifierNotificationComponent ): NotifierAnimationPreset => {
					let animationStart: Object;
					let animationEnd: Object;
					switch ( component.getConfig().position.horizontal.position ) {
						case 'left':
							let leftPosition: string = `calc( -100% - ${ component.getConfig().position.horizontal.distance }px - 10px )`;
							animationStart = {
								transform: `translate3d( 0, ${ component.getCurrentShift() }px, 0 )`
							};
							animationEnd = {
								transform: `translate3d( ${ leftPosition }, ${ component.getCurrentShift() }px, 0 )`
							};
							break;
						case 'middle':
							let middlePosition: string;
							switch ( component.getConfig().position.vertical.position ) {
								case 'top':
									middlePosition = `calc( -100% - ${ component.getConfig().position.horizontal.distance }px - 10px )`;
									break;
								case 'bottom':
									middlePosition = `calc( 100% + ${ component.getConfig().position.horizontal.distance }px + 10px )`;
									break;
							}
							animationStart = {
								transform: `translate3d( -50%, ${ component.getCurrentShift() }px, 0 )`
							};
							animationEnd = {
								transform: `translate3d( -50%, ${ middlePosition }, 0 )`
							};
							break;
						case 'right':
							let rightPosition: string = `calc( 100% + ${ component.getConfig().position.horizontal.distance }px + 10px )`;
							animationStart = {
								transform: `translate3d( 0, ${ component.getCurrentShift() }px, 0 )`
							};
							animationEnd = {
								transform: `translate3d( ${ rightPosition }, ${ component.getCurrentShift() }px, 0 )`
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
}
