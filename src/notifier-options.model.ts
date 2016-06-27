/**
 * External imports
 */
import { Injectable } from '@angular/core';

/**
 * Notification options model
 * TODO: Description
 */
@Injectable()
export class NotifierOptions {

	/**
	 * Positioning of all notifications
	 * Note: String maps to class name
	 */
	// public position: string;

	/**
	 * Notification theme
	 * Note: String maps to class name
	 */
	public theme: string;

	/**
	 * Notification animation
	 * Note: String maps to class name
	 */
	public animation: string;

	public position: Array<string>;

	public distances: Array<number>;

	/**
	 * Constructor
	 * @param {any = {}} options Custom options, default options as fallback
	 */
	constructor( options: Object = {
		'position': [ 'left', 'bottom' ],
		'distances': [ 10, 10, 10 ],
		'theme': 'material',
		'animation': 'fade'
	} ) {
		Object.assign( this, options ); // Merge
	}

}
