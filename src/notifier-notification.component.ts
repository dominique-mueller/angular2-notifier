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
import { NotifierTimerService } from './notifier-timer.service';

/**
 * Notifier notification component
 * TODO: Description
 */
@Component( {
	host: {
		'[class]': 'customClasses',
		'(mouseover)': 'onMouseover()',
		'(mouseout)': 'onMouseout()',
		'(click)': 'onClick()'
	},
	providers: [
		NotifierTimerService // Providing the service here allows us to use one timer service per notification
	],
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
	 * Internal: Notifier timer service reference
	 */
	private notifierTimerService: NotifierTimerService;

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

	/**
	 * Internal: Current (calculated) height (#perfmatters)
	 */
	private currentHeight: number;

	/**
	 * Internal: Current shift position (#perfmatters)
	 */
	private currentShift: number;

	/**
	 * Constructor - TODO
	 */
	constructor(
		notifierAnimationService: NotifierAnimationService,
		notifierTimerService: NotifierTimerService,
		renderer: Renderer,
		elementRef: ElementRef,
		@Optional() notifierOptions: NotifierOptions
	) {

		// Setup
		this.notifierAnimationService = notifierAnimationService;
		this.notifierTimerService = notifierTimerService;
		this.renderer = renderer;
		this.element = elementRef.nativeElement;
		this.created = new EventEmitter<NotifierNotificationComponent>();
		this.dismiss = new EventEmitter<NotifierNotificationComponent>();
		this.currentHeight = 0;
		this.currentShift = 0;

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

			// Start timer
			this.runTimer();

			// Finally, let's animate the bastard in (and return a fancy finished promise)
			return this.element.animate( animationPreset.keyframes, animationPreset.options ).finished;

		} else {

			// Start timer
			this.runTimer();

			// Move the bastard in
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

		// Stop the timer
		this.stopTimer();

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

	/**
	 * Call this function when we click on the notification
	 */
	private onClick(): void {
		if ( this.options.behaviour.dismissOnClick ) {
			this.stopTimer();
			this.dismiss.emit( this ); // Time is up
		}
	}

	/**
	 * Call this function when we hover over the notification area
	 */
	private onMouseover(): void {
		if ( this.options.behaviour.pauseOnMouseover ) {
			this.pauseTimer();
		} else if ( this.options.behaviour.resetOnMouseover ) {
			this.stopTimer();
		}
	}

	/**
	 * Call this function when we no longer hover over the notification area
	 */
	private onMouseout(): void {
		if ( this.options.behaviour.pauseOnMouseover || this.options.behaviour.resetOnMouseover ) {
			this.runTimer();
		}
	}

	/**
	 * Start the auto hide timer
	 */
	private runTimer(): void {
		if ( this.options.behaviour.autoHide !== false && this.options.behaviour.autoHide > 0 ) {
			this.notifierTimerService.run( <number> this.options.behaviour.autoHide, () => {
				this.dismiss.emit( this ); // Time is up
			} );
		}
	}

	/**
	 * Pause the auto hide timer
	 */
	private pauseTimer(): void {
		if ( this.options.behaviour.autoHide !== false && this.options.behaviour.autoHide > 0 ) {
			this.notifierTimerService.pause();
		}
	}

	/**
	 * Stop the auto hdie timer
	 */
	private stopTimer(): void {
		if ( this.options.behaviour.autoHide !== false && this.options.behaviour.autoHide > 0 ) {
			this.notifierTimerService.stop();
		}
	}

}
