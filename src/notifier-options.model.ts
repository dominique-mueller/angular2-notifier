/**
 * External imports
 */
import { Injectable } from '@angular/core';

/**
 * Notification options model
 */
@Injectable()
export class NotifierOptions {

	autoHide: boolean|number;

	// design: string; // Maps to CSS class

	constructor( options?: any ) {
		// console.log(options);
		this.autoHide = options.autoHide;
	}

}
