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
	 * Internal: Temporary queue for notifications
	 */
	private queue: Array<NotifierNotification>;

	/**
	 * Internal: Promise resolve function, when adding a notification
	 */
	private addNotificationResolver: Function;

	/**
	 * Constructor
	 */
	constructor( @Optional() notifierGlobalConfig: NotifierGlobalConfig ) {

		// Setup
		this.config = notifierGlobalConfig === null ? new NotifierGlobalConfig() : notifierGlobalConfig;
		this.notifications = [];
		this.queue = [];
		this.addNotificationResolver = null;

	}

	/**
	 * Add notification
	 */
	public addNotification( notification: NotifierNotification ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.notifications.push( notification );
			this.addNotificationResolver = resolve;
		} );
	}

	/**
	 * Remove all notifications
	 * @return {Promise<any>} Promise, resolved when finished
	 */
	public removeAllNotifications(): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {

			// Decision: Are even notifications here to remove / remove them with animations / without animations?
			if ( this.notifications.length === 0 ) {
				resolve(); // DONE
			} else if ( this.config.animations.enabled && this.config.animations.clear.offset > 0 ) {

				// Hide all notifications, depending on vertical position and animation offset
				for ( let i = this.notifications.length - 1; i >= 0; i-- ) {
					let animationOffset: number = this.config.position.vertical.position === 'top'
						? this.config.animations.clear.offset * ( this.notifications.length - i )
						: this.config.animations.clear.offset * i;
					setTimeout( () => { // Note: Promise.all() and setTimeout() hate each other ;)
						this.notifications[ i ].component.hide().then( () => {
							if ( i === 0 ) { // Remove all notifications when the last one got animated out
								this.notifications = []; // Burn them ... muhaha ...
								resolve(); // DONE
							}
						} );
					}, animationOffset );
				}

			} else {

				// Hide all notifications, all at the same time
				let animations: Array<Promise<any>> = [];
				for ( let i = this.notifications.length - 1; i >= 0; i-- ) {
					animations.push( this.notifications[ i ].component.hide() );
				}
				Promise.all( animations ).then( () => {
					this.notifications = []; // Burn them ... muhaha ...
					resolve(); // DONE
				} );

			}

		} );
	}

	/**
	 * Remove the first (and therefore oldest) notification
	 * @return {Promise<any>} Promise, resolved when finished
	 */
	public removeFirstNotification(): Promise<any> {
		return this.onDismiss( this.notifications[ 0 ].component );
	}

	/**
	 * Remove the last (and therefore newest) notification
	 * @return {Promise<any>} Promise, resolved when finished
	 */
	public removeLastNotification(): Promise<any> {
		return this.onDismiss( this.notifications[ this.notifications.length - 1 ].component );
	}

	/**
	 * Show notification, after it has been fully created
	 * @param {NotifierNotificationComponent} notificationComponent Notification component
	 */
	private onCreated( notificationComponent: NotifierNotificationComponent ): void {

		// Save our notification component reference
		this.notifications[ this.notifications.length - 1 ].component = notificationComponent;

		// Decision: First notification?
		if ( this.notifications.length > 1 ) {

			// Decision: Stacking enabled?
			if ( this.config.behaviour.stacking === false ) {

				// Hide the oldest notification, then show the new one
				this.dismissNotification( this.notifications[ 0 ].component ).then( () => {
					notificationComponent.show().then( () => {
						this.addNotificationResolver();
					} );
				} );

			} else {

				// Decision: Too many notifications opened?
				if ( this.notifications.length > this.config.behaviour.stacking ) {

					// Hide the oldest notification
					this.dismissNotification( this.notifications[ 0 ].component );

					// Shift all notifications to make some place (except the latest / last one)
					let notifications: Array<NotifierNotification> =
						this.notifications.slice( 1, this.notifications.length - 1 );
					setTimeout( () => { // Animation overlap
						this.shiftNotifications( notifications, notificationComponent.getHeight(), true );
					}, Math.round( this.config.animations.show.duration / 5 ) );

					// Show the new notification
					setTimeout( () => { // Animation overlap
						notificationComponent.show().then( () => {
							this.addNotificationResolver();
						} );
					}, Math.round( this.config.animations.show.duration / 2.5 ) );

				} else {

					// Shift all notifications to make enough place (except the latest / last one)
					let notifications: Array<NotifierNotification> =
						this.notifications.slice( 0, this.notifications.length - 1 );
					this.shiftNotifications( notifications, notificationComponent.getHeight(), true );

					// Show the new notification
					setTimeout( () => { // Animation overlap
						notificationComponent.show().then( () => {
							this.addNotificationResolver();
						} );
					}, Math.round( this.config.animations.show.duration / 5 ) );

				}

			}

		} else {
			notificationComponent.show().then( () => {
				this.addNotificationResolver();
			} );
		}

	}

	/**
	 * Hide notification, when it should be / gets dismissed
	 * @param  {NotifierNotificationComponent} notificationComponent Notification component
	 * @return {Promise<any>}                                        Promise, resolved when finished
	 */
	private onDismiss( notificationComponent: NotifierNotificationComponent ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {

			// Decision: Shift other notifications before hiding our one / just hide our notification?
			if ( this.notifications.length > 1 ) {
				this.dismissNotification( notificationComponent );
				setTimeout( () => { // Animation overlap
					let index: number = this.findNotificationIndexByComponent( notificationComponent );
					let notifications: Array<NotifierNotification> = this.notifications.slice( 0, index );
					this.shiftNotifications( notifications, notificationComponent.getHeight(), false ).then( () => {
						resolve(); // DONE
					} );
				}, Math.round( this.config.animations.show.duration / 5 ) );
			} else {
				this.dismissNotification( notificationComponent );
				resolve(); // DONE
			}

		} );
	}

	/**
	 * Dismiss one notification
	 * @param  {NotifierNotificationComponent} notificationComponent Notification component
	 * @return {Promise<any>}                                        Promise, resolved when finished
	 */
	private dismissNotification( notificationComponent: NotifierNotificationComponent ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			notificationComponent.hide().then( () => {
				this.notifications = this.notifications.filter( ( currentNotification: NotifierNotification ) => {
					return currentNotification.component !== notificationComponent;
				} );
				resolve(); // DONE
			} );
		} );
	}

	/**
	 * Shift multiple notifications
	 * @param {Array<NotifierNotification>} notifications List of notifications
	 * @param {number}                      value         Shift value / distance
	 * @param {boolean}                     toMakePlace   Shift direction flag
	 */
	private shiftNotifications( notifications: Array<NotifierNotification>, value: number, toMakePlace: boolean ):
		Promise<any> {
		let animations: Array<Promise<any>> = [];
		for ( let notification of notifications ) {
			animations.push( notification.component.shift( value, toMakePlace ) );
		}
		return Promise.all( animations ); // DONE
	}

	/**
	 * Find a notification in the notification list, by providing its notification component
	 * @param  {NotifierNotificationComponent} notificationComponent Notification component
	 * @return {number}                                              Index (in our case will always be there)
	 */
	private findNotificationIndexByComponent( notificationComponent: NotifierNotificationComponent ): number {
		return this.notifications.findIndex( ( notification: NotifierNotification ) => {
			return notification.component === notificationComponent;
		} );
	}

}
