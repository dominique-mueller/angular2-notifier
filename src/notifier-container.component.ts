/**
 * External imports
 */
import { Component, AfterViewInit, Optional, ViewChildren, Inject, QueryList } from '@angular/core';
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
		'[attr.class]': 'classMap'
	},
	selector: 'x-notifier-container',
	template: `
		<ul class="x-notifier__container-list">
			<li *ngFor="let notification of notifications">
				<x-notifier-notification [notification]="notification">
				</x-notifier-notification>
			</li>
		</ul>
		`
} )
export class NotifierContainerComponent implements AfterViewInit {

	/**
	 * Notifier options
	 */
	private options: NotifierOptions;

	/**
	 * Custom CSS classes, depending on notifier options
	 */
	private classMap: string;

	/**
	 * List of currently opened notifications
	 */
	private notifications: Array<NotifierNotification>;

	/**
	 * Number of currently opened notifications (updates a bit delayed)
	 */
	private numberOfNotifications: number;

	/**
	 * Reference list of currently opened notifications
	 */
	@ViewChildren( NotifierNotificationComponent )
	private notificationsRef: QueryList<NotifierNotificationComponent>;

	/**
	 * Constructor
	 * @param {NotifierOptions} @Optional() notifierOptions Custom notifier options
	 */
	constructor( @Optional() notifierOptions: NotifierOptions, @Inject( DOCUMENT ) doc: any ) {

		// Use custom notifier options if present
		this.options = notifierOptions === null ? new NotifierOptions() : notifierOptions;
		this.classMap = `x-notifier__container`;

		// Setup empty list of notifications
		this.notifications = [];
		this.numberOfNotifications = 0;

		// TODO: Save doc height for later?
		// console.log('++++');
		// console.log(doc);

	}

	/**
	 * Call this hook when the components gets initialized
	 */
	public ngAfterViewInit(): void {

		// TODO: Extract the upcoming stuff into own function
		this.notificationsRef.changes.subscribe( ( data: QueryList<NotifierNotificationComponent> ) => {

			if ( data.length > this.numberOfNotifications ) {
				// We got a new one
				console.log('NEW ONE');

				// Set / update values
				this.notifications[ this.numberOfNotifications ].component =
					data.toArray()[ this.numberOfNotifications ];

				// Skip first notification (no shifting necessary)
				if ( this.numberOfNotifications > 0 ) {

					// TODO: TEST ANIMATION
					// Iterate over all notfications (except the new one)
					let animationEndValue: number = 0;
					let distanceBetween: number = this.options.distances[ 2 ];
					let animationFinishedPromises: Array<any> = [];
					for ( let i: number = this.notifications.length - 2; i >= 0; i-- ) {

						let animationStartValue: number = animationEndValue; // Save start value
						animationEndValue += this.notifications[ i ].component.elementRef.nativeElement.offsetHeight + distanceBetween; // Calc end value

						// this.notifications[ i ].component.elementRef.nativeElement.style.transform = `translateY( -${ animationEndValue }px )`; // Animation through transition in CSS
						// this.notifications[ i ].component.elementRef.nativeElement.style.transform = `matrix( 1, 0, 0, 1, 0, -${ animationEndValue } )`;
						// console.log( getComputedStyle( this.notifications[ i ].component.elementRef.nativeElement ).getPropertyValue( 'transform' ) );

						// TODO: Extract "shiftAnimation" into notification component
						let animation: any = this.notifications[ i ].component.elementRef.nativeElement.animate(
							[ // TODO: Shorter version?
								{ // From ...
									transform: `translateY( -${ animationStartValue }px )`
								},
								{ // To ...
									transform: `translateY( -${ animationEndValue }px )`
								}
							],
							{
								duration: 400, // Duration in ms
								easing: 'ease-in-out',
								fill: 'forwards' // Keep position after paint
							}
						);
						animationFinishedPromises.push( animation.finished ); // Promise instead of callback ... yay!

					}

					Promise
						.all( animationFinishedPromises )
						.then( () => {
							this.notifications[ this.notifications.length - 1 ].component.animateIn();
							console.log('ANIMATION COMPLETELY FINISHED!');
						} );

				} else {
					setTimeout( () => {
						this.notifications[ this.notifications.length - 1 ].component.animateIn();
					} );
				}

				this.numberOfNotifications++;

				console.log(this.notifications);

			} else {
				// One got away
			}

			// TODO: Read values from doc
			// console.log( getComputedStyle( data.toArray()[ 0 ].elementRef.nativeElement ).getPropertyValue( 'bottom' ) );

		} );

	}

	public addNotification( notification: NotifierNotification ): void {

		this.notifications.push( notification );

		// setTimeout( () => {
		// 	this.notifications = [];
		// }, 2000 );

	}

}
