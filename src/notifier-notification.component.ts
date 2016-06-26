/**
 * External imports
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierNotification } from './notifier-notification.model';

/**
 * Notifier notification component
 * TODO: Description
 */
@Component( {
	host: {
		class: 'x-notifier__notification'
	},
	selector: '[x-notifier-notification]', // Attribute component (saves as some DOM elements)
	template: `
		{{ notification.type }}: {{ notification.message }}
		`
} )
export class NotifierNotificationComponent {

	/**
	 * Input parameter: Notification object
	 */
	@Input()
	notification: NotifierNotification;

}
