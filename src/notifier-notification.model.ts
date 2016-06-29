/**
 * External imports
 */
import { ElementRef } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierNotificationComponent } from './notifier-notification.component';

/**
 * Notification model
 * TODO: Description
 */
export class NotifierNotification {

	/**
	 * Notification type, maps to class name - TODO: Details
	 */
	public type: string;

	/**
	 * Notification message (string only for now) - TODO: HTML template?
	 */
	public message: string;

	/**
	 * Component reference
	 */
	public component: NotifierNotificationComponent;

	/**
	 * Constructor - TODO
	 */
	constructor( type: string, message: string ) {
		this.type = type;
		this.message = message;
		this.component = null;
	}

}
