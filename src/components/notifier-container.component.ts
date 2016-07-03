/**
 * External imports
 */
import { Component, Optional } from '@angular/core';
// import { DOCUMENT } from '@angular/platform-browser';

/**
 * Internal imports
 */
import { NotifierNotification } from './../models/notifier-notification.model';
import { NotifierGlobalConfig } from './../models/notifier-global-config.model';
import { NotifierService } from './../services/notifier.service';
import { NotifierAnimationService } from './../services/notifier-animations.service';
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
	 * Internal: Global notifier config
	 */
	private config: NotifierGlobalConfig;

	/**
	 * Internal: List of currently opened notifications
	 */
	private notifications: Array<NotifierNotification>;

	/**
	 * Constructor
	 */
	constructor( @Optional() notifierGlobalConfig: NotifierGlobalConfig ) {

		// Setup
		this.config = notifierGlobalConfig === null ? new NotifierGlobalConfig() : notifierGlobalConfig;
		this.notifications = [];

	}

	/**
	 * Add notification
	 */
	public addNotification( notification: NotifierNotification ): void {
		this.notifications.push( notification );
	}

	/**
	 * Remove all notifications
	 */
	public removeAllNotifications(): void {

		// Remove them in an animated way?
		if ( this.config.animations.enabled && this.config.animations.clear.offset > 0 ) {

			// Hide all notifications, but with a animation offset
			for ( let i = this.notifications.length - 1; i >= 0; i-- ) {
				let animationOffset: number = this.config.position.vertical.position === 'top'
					? this.config.animations.clear.offset * ( this.notifications.length - i )
					: this.config.animations.clear.offset * i;
				setTimeout( () => { // Note: Promise.all() and setTimeout() hate each other ;)
					this.notifications[ i ].component.hide().then( () => {
						if ( i === 0 ) { // Remove all notifications when the last one got animated out
							this.notifications = []; // Burn them ... muhaha ...
						}
					} );
				}, animationOffset );
			}

		} else {

			// Hide all notifications at the same time
			let animations: Array<Promise<any>> = [];
			for ( let i = this.notifications.length - 1; i >= 0; i-- ) {
				animations.push( this.notifications[ i ].component.hide() );
			}
			Promise.all( animations ).then( () => {
				this.notifications = []; // Burn them ... muhaha ...
			} );

		}

	}

	// TODO - Document height?
	private onCreated( notificationComponent: NotifierNotificationComponent ): void {

		// Save our notification component reference
		this.notifications[ this.notifications.length - 1 ].component = notificationComponent;

		// Decision: First notification?
		if ( this.notifications.length > 1 ) {

			// Decision: Stacking enabled?
			if ( this.config.behaviour.stacking === false ) {

				// Hide the oldest notification, then show the new one
				this.dismissNotification( this.notifications[ 0 ].component ).then( () => {
					notificationComponent.show();
				} );

			} else {

				// Decision: Too many notifications opened?
				if ( this.notifications.length > this.config.behaviour.stacking ) {

					// Hide the oldest notification
					this.dismissNotification( this.notifications[ 0 ].component );

					// Shift all notifications to make some place (except the latest / last one)
					setTimeout( () => { // Animation overlap
						this.shiftNotifications( this.notifications.slice( 1, this.notifications.length - 1 ),
							notificationComponent.getHeight(), true );
					}, Math.round( this.config.animations.show.duration / 5 ) );

					// Show the new notification
					setTimeout( () => { // Animation overlap
						notificationComponent.show();
					}, Math.round( this.config.animations.show.duration / 2.5 ) );

				} else {

					// Shift all notifications to make enough place (except the latest / last one)
					this.shiftNotifications( this.notifications.slice( 0, this.notifications.length - 1 ),
						notificationComponent.getHeight(), true );

					// Show the new notification
					setTimeout( () => { // Animation overlap
						notificationComponent.show();
					}, Math.round( this.config.animations.show.duration / 5 ) );

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
			}, Math.round( this.config.animations.show.duration / 5 ) );

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

}
