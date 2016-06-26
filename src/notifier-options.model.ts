/**
 * External imports
 */
import { Injectable } from '@angular/core';

/**
 * Notification options model
 */
@Injectable()
export class NotifierOptions {

	/**
	 * Positioning of all notifications
	 * Note: String maps to class name
	 */
	public position: string;

	/**
	 * Notification theme
	 * Note: String maps to class name
	 */
	public theme: string;

	/**
	 * Constructor
	 * @param {any = {}} options Custom options, default options as fallback
	 */
	constructor( options: Object = {
		'position': 'left-bottom',
		'theme': 'material'
	} ) {
		Object.assign( this, options ); // Merge
	}

}
