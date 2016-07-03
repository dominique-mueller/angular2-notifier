/**
 * External imports
 */
import { ElementRef } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierNotificationComponent } from './../components/notifier-notification.component';

/**
 * Notification model
 */
export class NotifierNotification {

	/**
	 * Notification type, maps to class name
	 */
	public type: string;

	/**
	 * Notification message (string only for now)
	 * TODO: HTML templates?
	 */
	public message: string;

	/**
	 * Component reference
	 */
	public component: NotifierNotificationComponent;

	/**
	 * Constructor
	 */
	constructor( type: string, message: string ) {
		this.type = type;
		this.message = message;
		this.component = null;
	}

}
