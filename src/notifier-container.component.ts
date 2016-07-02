/**
 * External imports
 */
import { Component, Optional, Inject } from '@angular/core';
// import { DOCUMENT } from '@angular/platform-browser';

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
					[notification]="notification" (created)="onCreated( $event )" (dismiss)="onDismiss( $event )">
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
	constructor( @Optional() notifierOptions: NotifierOptions ) {

		// Setup
		this.notifications = [];

		// Use custom notifier options if present
		this.options = notifierOptions === null ? new NotifierOptions() : notifierOptions;

	}

	// TODO - Split even more?? Document height?
	private onCreated( notificationComponent: NotifierNotificationComponent ): void {

		// Save our notification component reference
		this.notifications[ this.notifications.length - 1 ].component = notificationComponent;

		// Decision: First notification?
		if ( this.notifications.length > 1 ) {

			// Decision: Stacking enabled?
			if ( this.options.behaviour.stacking === false ) {

				// Hide the oldest notification, then show the new one
				this.dismissNotification( this.notifications[ 0 ].component ).then( () => {
					notificationComponent.show();
				} );

			} else {

				// Decision: Too many notifications opened?
				if ( this.notifications.length > this.options.behaviour.stacking ) {

					// Hide the oldest notification
					this.dismissNotification( this.notifications[ 0 ].component );

					// Shift all notifications to make some place (except the latest / last one)
					setTimeout( () => { // Animation overlap
						this.shiftNotifications( this.notifications.slice( 1, this.notifications.length - 1 ),
							notificationComponent.getHeight(), true );
					}, Math.round( this.options.animations.show.duration / 5 ) );

					// Show the new notification
					setTimeout( () => { // Animation overlap
						notificationComponent.show();
					}, Math.round( this.options.animations.show.duration / 2.5 ) );

				} else {

					// Shift all notifications to make enough place (except the latest / last one)
					this.shiftNotifications( this.notifications.slice( 0, this.notifications.length - 1 ),
						notificationComponent.getHeight(), true );

					// Show the new notification
					setTimeout( () => { // Animation overlap
						notificationComponent.show();
					}, Math.round( this.options.animations.show.duration / 5 ) );

				}

			}

		} else {
			notificationComponent.show();
		}

	}

	// TODO
	private onDismiss( notificationComponent: NotifierNotificationComponent ): void {

		// Decision: Only one notification here?
		if ( this.notifications.length > 1 ) {

			// Dismiss the notification
			this.dismissNotification( notificationComponent );

			// Shift all notifications (above / below the index) to remove the gap
			setTimeout( () => { // Animation overlap
				let index: number = this.findNotificationIndexByComponent( notificationComponent );
				this.shiftNotifications( this.notifications.slice( 0, index ),
					notificationComponent.getHeight(), false );
			}, Math.round( this.options.animations.show.duration / 5 ) );

		} else {
			this.dismissNotification( notificationComponent );
		}

	}

	/**
	 * Dismiss one notificaiton
	 */
	private dismissNotification( notificationComponent: NotifierNotificationComponent ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			notificationComponent.hide().then( () => {
				this.notifications = this.notifications.filter( ( currentNotification: NotifierNotification ) => {
					return currentNotification.component !== notificationComponent;
				} );
				resolve();
			} );
		} );
	}

	/**
	 * Shift multiple notifications
	 */
	private shiftNotifications( notifications: Array<NotifierNotification>, value: number, toMakePlace: boolean ): void {
		for ( let notification of notifications ) {
			notification.component.shift( value, toMakePlace );
		}
	}

	/**
	 * Find a notification and return its index
	 */
	private findNotificationIndexByComponent( notificationComponent: NotifierNotificationComponent ): number {
		return this.notifications.findIndex( ( notification: NotifierNotification ) => {
			return notification.component === notificationComponent;
		} );
	}

	public addNotification( notification: NotifierNotification ): void {
		this.notifications.push( notification );
	}

}
