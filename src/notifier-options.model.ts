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
	 * Auto hide (= timeout)
	 */
	// public autoHide: boolean|number;

	/**
	 * Show dismiss buttontton (showing an 'X'), which dismissed the notification when being clicked.
	 */
	// public showDismissButton: boolean;

	/**
	 * Stacking
	 */
	// public stacking: boolean|number;

	/**
	 * On Mouseover
	 */
	// public onMouseover: boolean|string;


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
		position: {
			gap: 8,
			horizontal: {
				distance: 12,
				position: 'left'
			},
			vertical: {
				distance: 12,
				position: 'bottom'
			}
		};
		theme: 'material'
	} ) {
		Object.assign( this, options ); // Merge
	}

}
