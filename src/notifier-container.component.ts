/**
 * External imports
 */
import { Component } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierNotification } from './notifier-notification.model';
import { NotifierNotificationComponent } from './notifier-notification.component';

/**
 * Notifier container component
 * TODO: Description
 */
@Component( {
	directives: [
		NotifierNotificationComponent
	],
	host: {
		class: 'x-notifier__container'
	},
	selector: 'x-notifier-container',
	template: `
		<ul>
			<li *ngFor="let notification of notifications" x-notifier-notification [notification]="notification">
			</li>
		</ul>
		`
} )
export class NotifierContainerComponent {

	private notifications: Array<NotifierNotification>;

	constructor() {
		this.notifications = [];
	}

	addNotification( notification: NotifierNotification ): void {
		this.notifications.push( notification );
	}

}
