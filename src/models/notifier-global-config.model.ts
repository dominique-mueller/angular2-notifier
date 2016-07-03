/**
 * External imports
 */
import { Injectable } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierGlobalOptions } from './notifier-global-options.model';

/**
 * Notification options model
 */
@Injectable()
export class NotifierGlobalConfig implements NotifierGlobalOptions {

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
	public theme: string;

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
		clear: {
			offset: number;
		};
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
	constructor( options: NotifierGlobalOptions = {
		animations: {
			clear: {
				offset: 50
			},
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
			dismissOnClick: false,
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
