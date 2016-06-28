/**
 * External imports
 */
import { Component, Input, Output, EventEmitter, Optional, AfterViewInit, ElementRef, Renderer } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierNotification } from './notifier-notification.model';
import { NotifierOptions } from './notifier-options.model';

/**
 * Notifier notification component
 * TODO: Description
 */
@Component( {
	host: {
		'class': 'x-notifier__notification'
	},
	selector: 'x-notifier-notification',
	template: `
		{{ notification.type }}: {{ notification.message }}
		`
} )
export class NotifierNotificationComponent implements AfterViewInit {

	/**
	 * Input parameter: Notification object
	 */
	@Input()
	private notification: NotifierNotification;

	@Output()
	private created: EventEmitter<any>;

	/**
	 * Rederer reference, e.g. for the DOM
	 */
	private renderer: Renderer;

	/**
	 * Notifier options
	 */
	private options: NotifierOptions;

	/**
	 * Reference to the native element of this component
	 */
	private element: any;

	private currentShiftValue: number;

	/**
	 * Constructor - TODO
	 */
	constructor( renderer: Renderer, elementRef: ElementRef, @Optional() notifierOptions: NotifierOptions ) {

		// Setup
		this.renderer = renderer;
		this.element = elementRef.nativeElement;
		this.created = new EventEmitter<any>();
		this.currentShiftValue = 0;

		// Use custom notifier options if present
		this.options = notifierOptions === null ? new NotifierOptions() : notifierOptions;

	}

	public ngAfterViewInit(): void {

		// Set position
		switch ( this.options.position[ 0 ] ) {
			case 'left':
				this.renderer.setElementStyle( this.element, 'left', `${ this.options.distances[ 0 ] }px` );
				break;
			case 'right':
				this.renderer.setElementStyle( this.element, 'right', `${ this.options.distances[ 0 ] }px` );
				break;
			default:
				break;
		}
		switch ( this.options.position[ 1 ] ) {
			case 'top':
				this.renderer.setElementStyle( this.element, 'top', `${ this.options.distances[ 1 ] }px` );
				break;
			case 'bottom':
				this.renderer.setElementStyle( this.element, 'bottom', `${ this.options.distances[ 1 ] }px` );
				break;
			default:
				break;
		}

		// Add classes
		this.renderer.setElementClass( this.element, `x-notifier__notification--${ this.options.theme }`, true );
		this.renderer.setElementStyle( this.element, 'opacity', '0' );

		// Tell the parent our new notification object
		this.notification.component = this;
		this.notification.height = this.element.offsetHeight; // -> DOM
		this.created.emit( this.notification );

	}

	public animateIn(): void {
		this.renderer.setElementStyle( this.element, 'visibility', 'visible' );
		return this.element.animate(
			[
				{ // From ...
					opacity: 0
					// transform: 'translate3d( -100%, 0, 0 )'
				},
				{ // To ...
					opacity: 1
					// transform: 'translate3d( 0, 0, 0 )'
				}
			],
			{
				delay: 10, // I mean ... why not ...
				duration: 300, // Duration in ms
				easing: 'ease-in-out',
				fill: 'forwards' // Keep position after paint
			}
		).finished; // Return finished Promise (no callbacks ... yay!)
	}

	public animateOut(): void {

	}

	// TODO: Promise type "Animation"?
	public animateShift( shiftDistance: number ): Promise<any> {
		let newShiftValue: number = this.currentShiftValue + shiftDistance + this.options.distances[ 2 ];
		let animation: any = this.element.animate(
			[
				{ // From ...
					transform: `translate3d( 0, -${ this.currentShiftValue }px, 0 )`
				},
				{ // To ...
					transform: `translate3d( 0, -${ newShiftValue }px, 0 )`
				}
			],
			{
				delay: 10, // I mean ... why not ...
				duration: 300, // Duration in ms
				easing: 'ease-in-out',
				fill: 'forwards' // Keep position after paint
			}
		);
		this.currentShiftValue = newShiftValue;
		return animation.finished; // Return finished Promise (no callbacks ... yay!)
	}

}
