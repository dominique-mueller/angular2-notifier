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
	 * Component
	 */
	public component: NotifierNotificationComponent;

	public index: number;

	public height: number;

	/**
	 * Constructor
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	constructor( type: string, message: string ) {
		this.type = type;
		this.message = message;
		this.component = null;
		this.index = 0;
		this.height = 0;
	}

}
