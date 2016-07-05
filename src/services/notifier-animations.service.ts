/**
 * External imports
 */
import { Injectable, Optional } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierGlobalConfig } from './../models/notifier-global-config.model';

/**
 * Notifier animation service (TODO)
 */
@Injectable()
export class NotifierAnimationService {

	/**
	 * Internal: Global notifier config
	 */
	private config: NotifierGlobalConfig;

	/**
	 * Animation presets
	 */
	private animationPresets: {
		[ method: string ]: {
			[ way: string ]: ( options: NotifierGlobalConfig ) => NotifierAnimationPreset
		};
	};

	/**
	 * Constructor, sets up config and animation presets
	 * @param {NotifierService} notifierService Notifier service
	 */
	public constructor( @Optional() notifierGlobalConfig: NotifierGlobalConfig ) {
		this.config = notifierGlobalConfig === null ? new NotifierGlobalConfig() : notifierGlobalConfig;
		this.setupAnimationPresets();
	}

	/**
	 * Get animation
	 */
	public getAnimation( name: string, way: string ): NotifierAnimation {

		// Get all necessary animation values
		const keyframes: NotifierAnimationPreset = this.animationPresets[ name ][ way ]( this.config );
		const duration: number = ( way === 'in' )
			? this.config.animations.show.duration
			: this.config.animations.hide.duration;
		const easing: string = ( way === 'in' )
			? this.config.animations.show.easing
			: this.config.animations.hide.easing;

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
	 * Initial animation preset setup
	 */
	private setupAnimationPresets(): void {

		// Setup animation presets
		this.animationPresets = {

			fade: {
				in: ( options: NotifierGlobalConfig ): NotifierAnimationPreset => {
					return {
						from: {
							opacity: 0
						},
						to: {
							opacity: 1
						}
					};
				},
				out: ( options: NotifierGlobalConfig ): NotifierAnimationPreset => {
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
				in: ( options: NotifierGlobalConfig ): NotifierAnimationPreset => {
					let animationStart: Object;
					let animationEnd: Object;
					switch ( options.position.horizontal.position ) {
						case 'left':
							let leftPosition: string =
								`calc( -100% - ${ options.position.horizontal.distance }px - 10px )`;
							animationStart = {
								transform: `translate3d( ${ leftPosition }, 0, 0 )`
							};
							animationEnd = {
								transform: 'translate3d( 0, 0, 0 )'
							};
							break;
						case 'middle':
							let middlePosition: string;
							switch ( options.position.vertical.position ) {
								case 'top':
									middlePosition =
										`calc( -100% - ${ options.position.horizontal.distance }px - 10px )`;
									break;
								case 'bottom':
									middlePosition =
										`calc( 100% + ${ options.position.horizontal.distance }px + 10px )`;
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
							let rightPosition: string =
								`calc( 100% + ${ options.position.horizontal.distance }px + 10px )`;
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
				out: ( options: NotifierGlobalConfig ): NotifierAnimationPreset => {
					let animationStart: Object;
					let animationEnd: Object;
					switch ( options.position.horizontal.position ) {
						case 'left':
							let leftPosition: string =
								`calc( -100% - ${ options.position.horizontal.distance }px - 10px )`;
							animationStart = {
								transform: 'translate3d( 0, 0, 0 )'
							};
							animationEnd = {
								transform: `translate3d( ${ leftPosition }, 0, 0 )`
							};
							break;
						case 'middle':
							let middlePosition: string;
							switch ( options.position.vertical.position ) {
								case 'top':
									middlePosition =
										`calc( -100% - ${ options.position.horizontal.distance }px - 10px )`;
									break;
								case 'bottom':
									middlePosition =
										`calc( 100% + ${ options.position.horizontal.distance }px + 10px )`;
									break;
							}
							animationStart = {
								transform: 'translate3d( -50%, 0, 0 )'
							};
							animationEnd = {
								transform: `translate3d( -50%, ${ middlePosition }, 0 )`
							};
							break;
						case 'right':
							let rightPosition: string =
								`calc( 100% + ${ options.position.horizontal.distance }px + 10px )`;
							animationStart = {
								transform: 'translate3d( 0, 0, 0 )'
							};
							animationEnd = {
								transform: `translate3d( ${ rightPosition }, 0, 0 )`
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

/**
 * Notifier animation
 */
export interface NotifierAnimation {
	keyframes: Array<any>;
	options: {
		delay: number;
		duration: number;
		easing: string;
		fill: string;
	};
}

/**
 * Notifier animation preset
 */
export interface NotifierAnimationPreset {
	from: Object;
	to: Object;
}
