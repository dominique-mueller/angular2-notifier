/**
 * External imports
 */
import { Injectable, Optional } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierOptions } from './../models/notifier-options-global.model';

/**
 * Notifier animation service
 * TODO: Description
 */
@Injectable()
export class NotifierAnimationService {

	/**
	 * Notifier options
	 */
	private options: NotifierOptions;

	/**
	 * Animation presets
	 */
	private animationPresets: {
		[ method: string ]: {
			[ way: string ]: ( options: NotifierOptions ) => NotifierAnimationPreset
		};
	};

	/**
	 * Constructor
	 */
	constructor( @Optional() notifierOptions: NotifierOptions ) {
		this.options = notifierOptions === null ? new NotifierOptions() : notifierOptions;
		this.setupAnimationPresets();
	}

	/**
	 * Get animation
	 */
	public getAnimation( name: string, way: string ): NotifierAnimation {

		// Get all necessary animation values
		const keyframes: NotifierAnimationPreset = this.animationPresets[ name ][ way ]( this.options );
		const duration: number = ( way === 'in' )
			? this.options.animations.show.duration
			: this.options.animations.hide.duration;
		const easing: string = ( way === 'in' )
			? this.options.animations.show.easing
			: this.options.animations.hide.easing;

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

				in: ( options: NotifierOptions ): NotifierAnimationPreset => {
					return {
						from: {
							opacity: 0
						},
						to: {
							opacity: 1
						}
					};
				},

				out: ( options: NotifierOptions ): NotifierAnimationPreset => {
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

				in: ( options: NotifierOptions ): NotifierAnimationPreset => {
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
								transform: `translate3d( ${ leftPosition }, 0, 0 )`
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

				out: ( options: NotifierOptions ): NotifierAnimationPreset => {
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
								transform: `translate3d( ${ leftPosition }, 0, 0 )`
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
