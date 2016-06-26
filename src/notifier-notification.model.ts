/**
 * External imports
 */
import { ElementRef } from '@angular/core';

/**
 * Notification model
 */
export class NotifierNotification {

	/**
	 * Notification type
	 */
	public type: string;

	/**
	 * Notification message
	 */
	public message: string;

	/**
	 * Calculated height (in the DOM)
	 */
	public elementRef: ElementRef;

	/**
	 * Constructor
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	constructor( type: string, message: string ) {
		this.type = type;
		this.message = message;
		this.elementRef = null;
	}

}
