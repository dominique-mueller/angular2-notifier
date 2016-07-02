/**
 * External imports
 */
import { Injectable } from '@angular/core';

/**
 * Notifier animation service
 * TODO: Description
 */
@Injectable()
export class NotifierAnimationService {

	private animationPresets: any;

	constructor() {
		this.animationPresets = {

			fade: {
				in: {
					from: {
						opacity: 0
					},
					to: {
						opacity: 1
					}
				},
				out: {
					from: {
						opacity: 1
					},
					to: {
						opacity: 0
					}
				}
			}

		};
	}

	public getAnimationPreset( name: string, way: string, duration: number, easing: string ): NotifierAnimationPreset {
		return {
			keyframes: [
				this.animationPresets[ name ][ way ].from,
				this.animationPresets[ name ][ way ].to
			],
			options: {
				delay: 10, // Give the browser some lunch time ...
				duration: duration, // Time in ms
				easing: easing,
				fill: 'forwards' // Keep the new state after the animation finished
			}
		};
	}

}

/**
 * Notifier animation preset
 */
export interface NotifierAnimationPreset {
	keyframes: Array<any>;
	options: {
		delay: number;
		duration: number;
		easing: string;
		fill: string;
	};
}
