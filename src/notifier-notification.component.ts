/**
 * External imports
 */
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Optional, Output, Renderer } from '@angular/core';

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
		'class': 'x-notifier__notification',
		'(click)': 'onDismiss()' // TODO: Remove / replace me
	},
	selector: 'x-notifier-notification',
	template: `
		{{ notification.type }}: {{ notification.message }}
		`
} )
export class NotifierNotificationComponent implements AfterViewInit {

	/**
	 * Input: Notification object
	 */
	@Input()
	private notification: NotifierNotification;

	/**
	 * Output: Created event, emits a reference to this component
	 */
	@Output()
	private created: EventEmitter<NotifierNotificationComponent>;

	/**
	 * Output: Dismiss event, emits a reference to this component
	 */
	@Output()
	private dismiss: EventEmitter<NotifierNotificationComponent>;

	/**
	 * Internal: Rederer reference
	 */
	private renderer: Renderer;

	/**
	 * Internal: Notifier options
	 */
	private options: NotifierOptions;

	/**
	 * Internal: DOM element reference
	 */
	private element: any; // It's kind of a 'HTMLElement' ... but ... no one knows for sure ...

	// TODO
	private currentHeight: number;

	// TODO
	private currentShift: number;

	// TODO
	private timerId: number;

	/**
	 * Constructor - TODO
	 */
	constructor( renderer: Renderer, elementRef: ElementRef, @Optional() notifierOptions: NotifierOptions ) {

		// Setup
		this.renderer = renderer;
		this.element = elementRef.nativeElement;
		this.created = new EventEmitter<NotifierNotificationComponent>();
		this.dismiss = new EventEmitter<NotifierNotificationComponent>();

		this.currentHeight = 0;
		this.currentShift = 0;
		this.timerId = null;

		// Use custom notifier options if present
		this.options = notifierOptions === null ? new NotifierOptions() : notifierOptions;

	}

	/**
	 * Initial setup (only once) - TODO
	 */
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

		// Add custom class
		this.renderer.setElementClass( this.element, `x-notifier__notification--${ this.options.theme }`, true );

		// Save current height (perf matters!)
		this.currentHeight = this.element.offsetHeight;

		// Throw created event, emit this notification component
		this.created.emit( this );

	}

	public getHeight(): number {
		return this.currentHeight;
	}

	/**
	 * Animate this notification component in
	 * @return {Promise<any>} Promise, resolved when animation has finished (resolves with 'Animation' object)
	 */
	public animateIn(): Promise<any> {
		this.renderer.setElementStyle( this.element, 'opacity', '0' ); // Prevent flicker
		this.renderer.setElementStyle( this.element, 'visibility', 'visible' );
		const animation: any = this.element.animate(
			[
				{ // From ...
					opacity: 0
				},
				{ // To ...
					opacity: 1
				}
			],
			{
				delay: 10, // I mean ... why not ...
				duration: 300, // Duration in ms
				easing: 'ease-in-out',
				fill: 'forwards' // Keep position after paint
			}
		);
		if ( this.options.autoHide !== false ) {
			this.startTimer();
		}
		return animation.finished; // Return finished Promise (no callbacks ... yay!)
	}

	/**
	 * Animate this notification component out
	 * @return {Promise<any>} Promise, resolved when animation has finished (resolves with 'Animation' object)
	 */
	public animateOut(): Promise<any> {
		const animation: any = this.element.animate(
			[
				{ // From ...
					opacity: 1
				},
				{ // To ...
					opacity: 0
				}
			],
			{
				delay: 10, // I mean ... why not ...
				duration: 300, // Duration in ms
				easing: 'ease-in-out',
				fill: 'forwards' // Keep position after paint
			}
		);
		return animation.finished; // Return finished Promise (no callbacks ... yay!)
	}

	/**
	 * Shift this notification component vertically
	 * @param  {number}       value Value (positive or negative), will be used as px value
	 * @return {Promise<any>}       Promise, resolved when animation has finished (resolves with 'Animation' object)
	 */
	public animateShift( value: number ): Promise<any> {
		let newShift: number;
		if ( value > 0 ) { // TODO: Better logic, depending on options (position)
			newShift = this.currentShift + value + this.options.distances[ 2 ];
		} else {
			newShift = this.currentShift - Math.abs( value ) - this.options.distances[ 2 ];
		}
		const animation: any = this.element.animate(
			[
				{ // From ...
					transform: `translate3d( 0, -${ this.currentShift }px, 0 )`
				},
				{ // To ...
					transform: `translate3d( 0, -${ newShift }px, 0 )`
				}
			],
			{
				delay: 10, // I mean ... why not ...
				duration: 300, // Duration in ms
				easing: 'ease-in-out',
				fill: 'forwards' // Keep position after paint
			}
		);
		this.currentShift = newShift;
		return animation.finished; // Return finished Promise (no callbacks ... yay!)
	}

	// TODO: Extract into own file, as Countdown class
	private startTimer(): void {
		this.timerId = setTimeout(
			() => {
				this.dismiss.emit( this );
			},
			this.options.autoHide
		);
	}

	// TODO
	public onDismiss(): void {
		clearTimeout( this.timerId );
		this.dismiss.emit( this );
	}

}
