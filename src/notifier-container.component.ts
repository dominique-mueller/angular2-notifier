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
import { NotifierAnimationService } from './notifier-animations.service';

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
	providers: [
		NotifierAnimationService
	],
	selector: 'x-notifier-container',
	template: `
		<ul class="x-notifier__container-list">
			<li *ngFor="let notification of notifications">
				<x-notifier-notification
					[notification]="notification"
					(created)="onCreated( $event )"
					(dismiss)="onDismiss( $event )">
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

	// TODO
	private onCreated( notificationComponent: NotifierNotificationComponent ): void {

		// Set notification component reference
		this.notifications[ this.notifications.length - 1 ].component = notificationComponent;

		// Check if this is the first notification (and therefore if shifting is even necessary)
		if ( this.notifications.length > 1 ) {

			// Shift all notifications (except the latest one)
			for ( let i: number = this.notifications.length - 2; i >= 0; i-- ) {
				this.notifications[ i ].component.shift( notificationComponent.getHeight(), true );
			}
			setTimeout(
				() => {
					notificationComponent.show();
				},
				Math.round( this.options.animations.show.duration / 5 )
			);

		} else {
			notificationComponent.show();
		}

	}

	// TODO
	private onDismiss( notificationComponent: NotifierNotificationComponent ): void {

		// Check if this is the first notification (and therefore if shifting is even necessary)
		if ( this.notifications.length > 1 ) {

			notificationComponent.hide().then( () => {
				this.notifications = this.notifications.filter( ( notification: NotifierNotification ) => { // TODO: Extract me into function
					return notification.component !== notificationComponent;
				} );
			} );

			setTimeout(
				() => {

					// Find index of the notification that should be removed
					let index: number = this.notifications.findIndex( ( notification: NotifierNotification ) => {
						return notification.component === notificationComponent;
					} );

					// Shift all notifications below / above the current one
					for ( let i: number = index; i >= 0; i-- ) {
						this.notifications[ i ].component.shift( notificationComponent.getHeight(), false );
					}

				},
				Math.round( this.options.animations.show.duration / 5 )
			);

		} else {

			notificationComponent.hide().then( () => {
				this.notifications = this.notifications.filter( ( notification: NotifierNotification ) => { // TODO: Extract me into function
					return notification.component !== notificationComponent;
				} );
			} );

		}

	}

	public addNotification( notification: NotifierNotification ): void {
		this.notifications.push( notification );
	}

	public removeNotification(): void {
		// this.notifications.pop();
		console.log( this.notifications[ 0 ] === this.notifications[ 1 ] );
	}

}
