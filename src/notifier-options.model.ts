/**
 * External imports
 */
import { Injectable } from '@angular/core';

/**
 * Notification options model
 * TODO: Description
 */
@Injectable()
export class NotifierOptions { // TODO: Global & local ones

	/**
	 * Notification position
	 */
	public position: {
		gap: number;
		horizontal: {
			distance: number;
			position: string;
		};
		vertical: {
			distance: number;
			position: string;
		};
	};

	/**
	 * Notification theme (class)
	 */
	public theme: string; // STABLE

	/**
	 * Behaviour
	 */
	public behaviour: {
		autoHide: number|boolean;
		pauseOnMouseover: boolean;
		resetOnMouseover: boolean;
		dismissOnClick: boolean;
		stacking: number|boolean;
		showDismissButton: boolean;
	};

	/**
	 * Animations
	 */
	public animations: {
		enabled: boolean;
		hide: {
			duration: number;
			easing: string;
			method: string;
		};
		shift: {
			duration: number;
			easing: string;
		};
		show: {
			duration: number;
			easing: string;
			method: string;
		};
	};

	/**
	 * Constructor
	 * @param {any = {}} options Custom options, default options as fallback
	 */
	constructor( options: Object = {
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
				method: 'fade'
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
	} ) {
		Object.assign( this, options ); // Merge
	}

}
