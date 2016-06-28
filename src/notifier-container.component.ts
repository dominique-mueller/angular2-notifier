/**
 * External imports
 */
import { Component, Optional, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

/**
 * Internal imports
 */
import { NotifierNotification } from './notifier-notification.model';
import { NotifierOptions } from './notifier-options.model';
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
		'class': 'x-notifier__container'
	},
	selector: 'x-notifier-container',
	template: `
		<ul class="x-notifier__container-list">
			<li *ngFor="let notification of notifications">
				<x-notifier-notification [notification]="notification" (created)="onCreated( $event )">
				</x-notifier-notification>
			</li>
		</ul>
		`
} )
export class NotifierContainerComponent {

	/**
	 * Notifier options
	 */
	private options: NotifierOptions;

	/**
	 * List of currently opened notifications
	 */
	private notifications: Array<NotifierNotification>;

	/**
	 * Constructor - TODO
	 */
	constructor( @Optional() notifierOptions: NotifierOptions, @Inject( DOCUMENT ) doc: any ) {

		// Use custom notifier options if present
		this.options = notifierOptions === null ? new NotifierOptions() : notifierOptions;

		// Setup empty list of notifications
		this.notifications = [];

		// TODO: Save doc height for later?
		// console.log('++++');
		// console.log(doc);

	}

	public onCreated( updatedNotification: NotifierNotification ): void {

		// Update notification
		this.notifications[ this.notifications.length - 1 ] = updatedNotification;

		// Check if this is the first notification (and therefore if shifting is even necessary)
		if ( this.notifications.length > 1 ) {

			// Shift all notifications (except the latest one)
			let animationPromises: Array<Promise<any>> = [];
			for ( let i: number = this.notifications.length - 2; i >= 0; i-- ) {
				animationPromises.push( this.notifications[ i ].component.animateShift( updatedNotification.height ) );
			}
			Promise.all( animationPromises ).then( () => {
				updatedNotification.component.animateIn();
			} );

		} else {
			updatedNotification.component.animateIn();
		}

	}

	public addNotification( notification: NotifierNotification ): void {
		notification.index = this.notifications.length - 1;
		this.notifications.push( notification );
	}

}
