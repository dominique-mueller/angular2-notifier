/**
 * External imports
 */
import { Component, Optional } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierNotification } from './../models/notifier-notification.model';
import { NotifierGlobalConfig } from './../models/notifier-global-config.model';
import { NotifierAction } from './../models/notifier-action.model';
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
	 * Internal: Action queue (prevent weirdness when stuff happens at the same time)
	 */
	private queue: {
		actions: Array<NotifierAction>;
		inProgress: boolean;
	};

	/**
	 * Internal: Promise resolve function, when adding a notification
	 */
	private tempNotificationResolver: Function;

	/**
	 * Constructor
	 */
	constructor( @Optional() notifierGlobalConfig: NotifierGlobalConfig ) {

		// Setup
		this.config = notifierGlobalConfig === null ? new NotifierGlobalConfig() : notifierGlobalConfig;
		this.notifications = [];
		this.queue = {
			actions: [],
			inProgress: false
		};
		this.tempNotificationResolver = null;

	}

	/**
	 * Run an action; this should be the one and only entry point of this component
	 * @param  {NotifierAction} action Action
	 * @return {Promise<any>}          Promise, resolved when finished
	 */
	public doAction( action: NotifierAction ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			action.resolve = resolve;
			this.queue.actions.push( action );
			this.doNextActionInQueue();
		} );
	}

	/**
	 * Continue with the next action in the queue
	 */
	private doNextActionInQueue(): void {

		// Check if we're already working on some action within the queue
		if ( this.queue.inProgress ) {
			return; // We have only one worker for our queue
		} else if ( this.queue.actions.length > 0 ) {

			this.queue.inProgress = true;
			const action: NotifierAction = this.queue.actions.shift();
			switch ( action.type ) {

				// Show a new notification
				case 'SHOW':
					this.addNotification( action.payload )
						.then( () => {
							action.resolve(); // DONE
							this.queue.inProgress = false;
							this.doNextActionInQueue(); // Recursion ...
						} );
					break;

				// Hide an existing notification
				case 'HIDE':
					console.log(action);
					this.removeNotification( action.payload )
						.then( () => {
							action.resolve(); // DONE
							this.queue.inProgress = false;
							this.doNextActionInQueue(); // Recursion ...
						} );
					break;

				// Clear all notifications
				case 'CLEAR_ALL':
					this.removeAllNotifications()
						.then( () => {
							action.resolve(); // DONE
							this.queue.inProgress = false;
							this.doNextActionInQueue(); // Recursion ...
						} );
					break;

				// Clear all notifications
				case 'CLEAR_OLDEST':
					this.removeNotification( this.notifications[ 0 ].component )
						.then( () => {
							action.resolve(); // DONE
							this.queue.inProgress = false;
							this.doNextActionInQueue(); // Recursion ...
						} );
					break;

				// Clear all notifications
				case 'CLEAR_NEWEST':
					this.removeNotification( this.notifications[ this.notifications.length - 1 ].component )
						.then( () => {
							action.resolve(); // DONE
							this.queue.inProgress = false;
							this.doNextActionInQueue(); // Recursion ...
						} );
					break;

			}

		}

	}

	/**
	 * Event handler, gets called when the notification component has been initialized
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
				this.animateOutNotification( this.notifications[ 0 ].component ).then( () => {
					notificationComponent.show().then( () => {
						this.tempNotificationResolver();
					} );
				} );

			} else {

				// Decision: Too many notifications opened?
				if ( this.notifications.length > this.config.behaviour.stacking ) {

					// Hide the oldest notification, shift other notifications, show our new notification
					this.animateOutNotification( this.notifications[ 0 ].component );
					let notifications: Array<NotifierNotification> =
						this.notifications.slice( 1, this.notifications.length - 1 );
					setTimeout( () => { // Animation overlap
						this.animateShiftNotifications( notifications, notificationComponent.getHeight(), true );
					}, Math.round( this.config.animations.show.duration / 5 ) );
					setTimeout( () => { // Animation overlap
						notificationComponent.show().then( () => {
							this.tempNotificationResolver();
						} );
					}, Math.round( this.config.animations.show.duration / 2.5 ) );

				} else {

					// Shift other notifications, show our new notification
					let notifications: Array<NotifierNotification> =
						this.notifications.slice( 0, this.notifications.length - 1 );
					this.animateShiftNotifications( notifications, notificationComponent.getHeight(), true );
					setTimeout( () => { // Animation overlap
						notificationComponent.show().then( () => {
							this.tempNotificationResolver();
						} );
					}, Math.round( this.config.animations.show.duration / 5 ) );

				}

			}

		} else {
			notificationComponent.show().then( () => {
				this.tempNotificationResolver();
			} );
		}

	}

	/**
	 * Event handler, gets called when the notification component should be dismissed
	 * @param {NotifierNotificationComponent} notificationComponent Notification component
	 */
	private onDismiss( notificationComponent: NotifierNotificationComponent ): void {
		this.doAction( {
			type: 'HIDE',
			payload: notificationComponent
		} );
	}

	/**
	 * Add a new notification
	 * @param  {NotifierNotification} notification Notification
	 * @return {Promise<any>}                      Promise, resolved when finished
	 */
	private addNotification( notification: NotifierNotification ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {
			this.notifications.push( notification );
			this.tempNotificationResolver = resolve;
		} );
	}

	/**
	 * Remove all notifications
	 * @return {Promise<any>} Promise, resolved when finished
	 */
	private removeAllNotifications(): Promise<any> {
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
	 * Remove one notification
	 * @param  {NotifierNotificationComponent} notificationComponent [description]
	 * @return {Promise<any>}                                        [description]
	 */
	private removeNotification( notificationComponent: NotifierNotificationComponent ): Promise<any> {
		return new Promise<any>( ( resolve: Function, reject: Function ) => {

			// Decision: Shift other notifications before hiding our one / just hide our notification?
			if ( this.notifications.length > 1 ) {
				this.animateOutNotification( notificationComponent );
				setTimeout( () => { // Animation overlap
					let index: number = this.getNotificationIndex( notificationComponent );
					let notifications: Array<NotifierNotification> = this.notifications.slice( 0, index );
					this.animateShiftNotifications( notifications, notificationComponent.getHeight(), false )
						.then( () => {
							resolve(); // DONE
						} );
				}, Math.round( this.config.animations.show.duration / 5 ) );
			} else {
				this.animateOutNotification( notificationComponent );
				resolve(); // DONE
			}

		} );
	}

	/**
	 * Dismiss one notification
	 * @param  {NotifierNotificationComponent} notificationComponent Notification component
	 * @return {Promise<any>}                                        Promise, resolved when finished
	 */
	private animateOutNotification( notificationComponent: NotifierNotificationComponent ): Promise<any> {
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
	private animateShiftNotifications( notifications: Array<NotifierNotification>, value: number,
		toMakePlace: boolean ): Promise<any> {
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
	private getNotificationIndex( notificationComponent: NotifierNotificationComponent ): number {
		return this.notifications.findIndex( ( notification: NotifierNotification ) => {
			return notification.component === notificationComponent;
		} );
	}

}
