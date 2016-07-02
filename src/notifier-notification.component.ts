/**
 * External imports
 */
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Optional, Output, Renderer } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierNotification } from './notifier-notification.model';
import { NotifierOptions } from './notifier-options.model';
import { NotifierAnimationService, NotifierAnimationPreset } from './notifier-animations.service';

/**
 * Notifier notification component
 * TODO: Description
 */
@Component( {
	host: {
		'[class]': 'customClasses',
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
	 * Internal: Renderer reference
	 */
	private renderer: Renderer;

	/**
	 * Internal: Notifier animation service reference
	 */
	private notifierAnimationService: NotifierAnimationService;

	/**
	 * Internal: Notifier options
	 */
	private options: NotifierOptions;

	/**
	 * Internal: DOM element reference
	 */
	private element: any; // It's kind of a 'HTMLElement' ... but ... no one knows for sure ...

	/**
	 * Internal: List of (custom) class names, actually never changes
	 */
	private customClasses: string;




	// TODO
	private currentHeight: number;

	// TODO
	private currentShift: number;






	// TODO
	private timerId: number;





	/**
	 * Constructor - TODO
	 */
	constructor(
		notifierAnimationService: NotifierAnimationService,
		renderer: Renderer,
		elementRef: ElementRef,
		@Optional() notifierOptions: NotifierOptions
	) {

		// Setup
		this.notifierAnimationService = notifierAnimationService;
		this.renderer = renderer;
		this.element = elementRef.nativeElement;
		this.created = new EventEmitter<NotifierNotificationComponent>();
		this.dismiss = new EventEmitter<NotifierNotificationComponent>();
		this.currentHeight = 0;
		this.currentShift = 0;
		this.timerId = null;

		// Set and use options
		this.options = notifierOptions === null ? new NotifierOptions() : notifierOptions;
		this.customClasses = `x-notifier__notification x-notifier__notification--${ this.options.theme }`;

	}

	/**
	 * Initial setup (only once)
	 */
	public ngAfterViewInit(): void {
		this.setup();
		this.currentHeight = this.element.offsetHeight; // Save current height, for later (#perfmatters)
		this.created.emit( this ); // We're done with the setup
	}

	/**
	 * Setup notification
	 */
	private setup(): void {

		// Set horizontal position
		switch ( this.options.position.horizontal.position ) {
			case 'left':
				this.renderer.setElementStyle( this.element, 'left', `${ this.options.position.horizontal.distance }px` );
				break;
			case 'right':
				this.renderer.setElementStyle( this.element, 'right', `${ this.options.position.horizontal.distance }px` );
				break;
			case 'middle':
				this.renderer.setElementStyle( this.element, 'left', '50%' );
				this.renderer.setElementStyle( this.element, 'transform', 'translate3d( -50%, 0, 0 )' );
				break;
		}

		// Set vertical position
		switch ( this.options.position.vertical.position ) {
			case 'top':
				this.renderer.setElementStyle( this.element, 'top', `${ this.options.position.vertical.distance }px` );
				break;
			case 'bottom':
				this.renderer.setElementStyle( this.element, 'bottom', `${ this.options.position.vertical.distance }px` );
				break;
		}

	}

	public getHeight(): number {
		return this.currentHeight;
	}

	// TODO: Extract into own file, as Countdown class
	// private startTimer(): void {
	// 	// this.timerId = setTimeout(
	// 	// 	() => {
	// 	// 		this.dismiss.emit( this );
	// 	// 	},
	// 	// 	this.options.autoHide
	// 	// );
	// }

	// TODO
	public onDismiss(): void {
		clearTimeout( this.timerId );
		this.dismiss.emit( this );
	}

	/**
	 * Animate this notification component in
	 */
	public show(): Promise<any> {

		// First, check if animations are enabled
		if ( this.options.animations.enabled ) {

			// Get our animation preset
			const animationPreset: NotifierAnimationPreset = this.notifierAnimationService.getAnimationPreset(
				this.options.animations.show.method,
				'in',
				this.options.animations.show.duration,
				this.options.animations.show.easing
			);

			// Prepare element for animation before making it visible (in order to preven flickering)
			for ( let key in animationPreset.keyframes[ 0 ] ) {
				this.renderer.setElementStyle( this.element, key, animationPreset.keyframes[ 0 ][ key ] );
			}
			this.renderer.setElementStyle( this.element, 'visibility', 'visible' );

			// Finally, let's animate the bastard in (and return a fancy finished promise)
			return this.element.animate( animationPreset.keyframes, animationPreset.options ).finished;

		} else {
			this.renderer.setElementStyle( this.element, 'visibility', 'visible' );
			return new Promise<any>( ( resolve: Function, reject: Function ) => {
				resolve( null );
			} );
		}

	}

	/**
	 * Animate this notification component out
	 */
	public hide(): Promise<any> {

		// First, check if animations are enabled
		if ( this.options.animations.enabled ) {

			// Get our animation preset
			const animationPreset: NotifierAnimationPreset = this.notifierAnimationService.getAnimationPreset(
				this.options.animations.hide.method,
				'out',
				this.options.animations.hide.duration,
				this.options.animations.hide.easing
			);

			// Finally, let's animate the bastard in (and return a fancy finished promise)
			return this.element.animate( animationPreset.keyframes, animationPreset.options ).finished;

		} else {
			return new Promise<any>( ( resolve: Function, reject: Function ) => {
				resolve( null );
			} );
		}

	}

	/**
	 * Shift this notification component vertically
	 */
	public shift( value: number, toMakePlace: boolean ): Promise<any> {

		// First, calculate values for our new position (after the shift)
		let newShift: number;
		switch ( this.options.position.vertical.position ) {
			case 'top':
				if ( toMakePlace ) {
					newShift = this.currentShift + value + this.options.position.gap;
				} else {
					newShift = this.currentShift - value - this.options.position.gap;
				}
				break;
			case 'bottom':
				if ( toMakePlace ) {
					newShift = this.currentShift - value - this.options.position.gap;
				} else {
					newShift = this.currentShift + value + this.options.position.gap;
				}
				break;
		}
		const base: string = this.options.position.horizontal.position === 'middle' ? '-50%' : '0';

		// Then, check if animations are enabled
		if ( this.options.animations.enabled ) {

			// Let's shift the notification around
			const animation: any = this.element.animate(
				[
					{ // From ...
						transform: `translate3d( ${ base }, ${ this.currentShift }px, 0 )`
					},
					{ // To ...
						transform: `translate3d( ${ base }, ${ newShift }px, 0 )`
					}
				],
				{
					delay: 10, // Give the browser some lunch time ...
					duration: this.options.animations.shift.duration,
					easing: this.options.animations.shift.easing, // Time in ms
					fill: 'forwards' // Keep the new state after the animation finished
				}
			);

			// Update shift, return
			this.currentShift = newShift;
			return animation.finished; // Return finished Promise (no callbacks ... yay!)

		} else {
			this.renderer.setElementStyle( this.element, 'transform', `translate3d( ${ base }, ${ newShift }px, 0 )` );
			return new Promise<any>( ( resolve: Function, reject: Function ) => {
				resolve( null );
			} );
		}

	}

}
