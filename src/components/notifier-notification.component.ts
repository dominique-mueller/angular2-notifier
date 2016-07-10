/**
 * External imports
 */
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Optional, Output, Renderer } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierNotification } from './../models/notifier-notification.model';
import { NotifierGlobalConfig } from './../models/notifier-global-config.model';
import { NotifierAnimation } from './../models/notifier-animation.model';
import { NotifierAnimationService } from './../services/notifier-animations.service';
import { NotifierTimerService } from './../services/notifier-timer.service';

/**
 * Notifier notification component
 * This component displays the actual notification, and also handles interactions with it
 */
@Component( {
	host: {
		'(mouseover)': 'onMouseover()',
		'(mouseout)': 'onMouseout()',
		'(click)': 'onClick()'
	},
	providers: [
		NotifierTimerService // Providing the service here allows us to use one timer service per notification
	],
	selector: 'x-notifier-notification',
	template: `
		<p class="x-notifier__notification-message">{{ notification.message }}</p>
		<button class="x-notifier__notification-button" type="button" title="dismiss"
			*ngIf="config.behaviour.showDismissButton" (click)="onDismiss()">
			<svg class="x-notifier__notification-dismiss" viewBox="0 0 24 24" width="20" height="20">
				<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
			</svg>
		</button>
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
	 * Renderer reference
	 */
	private renderer: Renderer;

	/**
	 * Notifier animation service reference
	 */
	private notifierAnimationService: NotifierAnimationService;

	/**
	 * Notifier timer service reference
	 */
	private notifierTimerService: NotifierTimerService;

	/**
	 * Global notifier config
	 */
	private config: NotifierGlobalConfig;

	/**
	 * DOM element reference
	 */
	private element: any; // It's kind of a 'HTMLElement' ... but at the same time it's not ... at least not 100% ...

	/**
	 * Current (calculated) height (#perfmatters)
	 */
	private currentHeight: number;

	/**
	 * Current shift position (#perfmatters)
	 */
	private currentShift: number;

	/**
	 * Constructor
	 * @param {ElementRef}               elementRef               Reference of this element
	 * @param {Renderer}                 renderer                 Renderer
	 * @param {NotifierAnimationService} notifierAnimationService Notifier animation service
	 * @param {NotifierTimerService}     notifierTimerService     Notifier timer service
	 * @param {NotifierGlobalConfig}     notifierGlobalConfig     Global notifier configuration
	 */
	public constructor( elementRef: ElementRef, renderer: Renderer, notifierAnimationService: NotifierAnimationService,
		notifierTimerService: NotifierTimerService, @Optional() notifierGlobalConfig: NotifierGlobalConfig ) {
		this.notifierAnimationService = notifierAnimationService;
		this.notifierTimerService = notifierTimerService;
		this.renderer = renderer;
		this.config = notifierGlobalConfig === null ? new NotifierGlobalConfig() : notifierGlobalConfig;
		this.element = elementRef.nativeElement;
		this.created = new EventEmitter<NotifierNotificationComponent>();
		this.dismiss = new EventEmitter<NotifierNotificationComponent>();
		this.currentHeight = 0;
		this.currentShift = 0;
	}

	/**
	 * Initial setup (executed only once)
	 */
	public ngAfterViewInit(): void {
		this.setup();
		this.currentHeight = this.element.offsetHeight; // Save current height, for later (#perfmatters)
		this.created.emit( this ); // Setup is done
	}

	/**
	 * Get component height
	 */
	public getHeight(): number {
		return this.currentHeight;
	}

	/**
	 * Get component config
	 */
	public getConfig(): NotifierGlobalConfig {
		return this.config;
	}

	/**
	 * Get current component height
	 */
	public getCurrentHeight(): number {
		return this.currentHeight;
	}

	/**
	 * Get current component shift
	 */
	public getCurrentShift(): number {
		return this.currentShift;
	}

	/**
	 * Show this notification component by animating it in
	 * @return {Promise<any>} Promise, resolved when finished
	 */
	public show(): Promise<any> {

		// Start the timer
		this.runTimer();

		// Decision: Are animations enabled / or not?
		if ( this.config.animations.enabled ) {

			// Get our animation preset
			const animationPreset: NotifierAnimation = this.notifierAnimationService.getAnimation(
				this.config.animations.show.method, 'in', this );

			// Prepare element for animation (prevent flickering), then animate the bastart in
			for ( let key in animationPreset.keyframes[ 0 ] ) {
				this.renderer.setElementStyle( this.element, key, animationPreset.keyframes[ 0 ][ key ] );
			}
			this.renderer.setElementStyle( this.element, 'visibility', 'visible' );
			return this.element.animate( animationPreset.keyframes, animationPreset.options ).finished;

		} else {
			return new Promise<any>( ( resolve: Function, reject: Function ) => {
				this.renderer.setElementStyle( this.element, 'visibility', 'visible' );
				resolve();
			} );
		}

	}

	/**
	 * Hide this notification component by animating it out
	 * @return {Promise<any>} Promise, resolved when finished
	 */
	public hide(): Promise<any> {

		// Stop the timer
		this.stopTimer();

		// Decision: Are animations enabled / or not?
		if ( this.config.animations.enabled ) {
			const animationPreset: NotifierAnimation = this.notifierAnimationService.getAnimation(
				this.config.animations.hide.method, 'out', this );
			return this.element.animate( animationPreset.keyframes, animationPreset.options ).finished;
		} else {
			return new Promise<any>( ( resolve: Function, reject: Function ) => {
				resolve();
			} );
		}

	}

	/**
	 * Shift this notification component vertically
	 * @param  {number}       value       Distance to shift, in px
	 * @param  {boolean}      toMakePlace Shift direction
	 * @return {Promise<any>}             Promise, resolved when finished
	 */
	public shift( value: number, toMakePlace: boolean ): Promise<any> {

		// First, calculate values for our new position (after the shift)
		let newShift: number;
		switch ( this.config.position.vertical.position ) {
			case 'top':
				if ( toMakePlace ) {
					newShift = this.currentShift + value + this.config.position.gap;
				} else {
					newShift = this.currentShift - value - this.config.position.gap;
				}
				break;
			case 'bottom':
				if ( toMakePlace ) {
					newShift = this.currentShift - value - this.config.position.gap;
				} else {
					newShift = this.currentShift + value + this.config.position.gap;
				}
				break;
		}
		const base: string = this.config.position.horizontal.position === 'middle' ? '-50%' : '0';

		// Decision: Are animations enabled / or not?
		if ( this.config.animations.enabled ) {

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
					duration: this.config.animations.shift.duration,
					easing: this.config.animations.shift.easing, // Time in ms
					fill: 'forwards' // Keep the new state after the animation finished
				}
			);
			this.currentShift = newShift;
			return animation.finished; // Return finished Promise (no callbacks ... yay!)

		} else {
			return new Promise<any>( ( resolve: Function, reject: Function ) => {
				this.renderer.setElementStyle( this.element, 'transform', `translate3d( ${ base }, ${ newShift }px, 0 )` );
				this.currentShift = newShift;
				resolve();
			} );
		}

	}

	/**
	 * Setup notification
	 */
	private setup(): void {

		// Set horizontal position
		switch ( this.config.position.horizontal.position ) {
			case 'left':
				this.renderer.setElementStyle( this.element, 'left',
					`${ this.config.position.horizontal.distance }px` );
				break;
			case 'right':
				this.renderer.setElementStyle( this.element, 'right',
					`${ this.config.position.horizontal.distance }px` );
				break;
			case 'middle':
				this.renderer.setElementStyle( this.element, 'left', '50%' );
				this.renderer.setElementStyle( this.element, 'transform', 'translate3d( -50%, 0, 0 )' );
				break;
		}

		// Set vertical position
		switch ( this.config.position.vertical.position ) {
			case 'top':
				this.renderer.setElementStyle( this.element, 'top',
					`${ this.config.position.vertical.distance }px` );
				break;
			case 'bottom':
				this.renderer.setElementStyle( this.element, 'bottom',
					`${ this.config.position.vertical.distance }px` );
				break;
		}

		// Set classes
		this.renderer.setElementClass( this.element, 'x-notifier__notification', true );
		this.renderer.setElementClass( this.element, `x-notifier__notification--${ this.notification.type }`, true );
		this.renderer.setElementClass( this.element, `x-notifier__notification--${ this.config.theme }`, true );

	}

	/**
	 * Start the auto hide timer
	 */
	private runTimer(): void {
		if ( this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0 ) {
			this.notifierTimerService.run( this.config.behaviour.autoHide as number, () => {
				this.dismiss.emit( this ); // Time is up
			} );
		}
	}

	/**
	 * Pause the auto hide timer
	 */
	private pauseTimer(): void {
		if ( this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0 ) {
			this.notifierTimerService.pause();
		}
	}

	/**
	 * Stop the auto hdie timer
	 */
	private stopTimer(): void {
		if ( this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0 ) {
			this.notifierTimerService.stop();
		}
	}

	/* tslint:disable:no-unused-variable - because the functions are only called by the template / annotation */

	/**
	 * Event handler: Call this function when we click on the notification
	 */
	private onDismiss(): void {
		this.stopTimer();
		this.dismiss.emit( this );
	}

	/**
	 * Event handler: Call this function when we hover over the notification area
	 */
	private onMouseover(): void {
		if ( this.config.behaviour.pauseOnMouseover ) {
			this.pauseTimer();
		} else if ( this.config.behaviour.resetOnMouseover ) {
			this.stopTimer();
		}
	}

	/**
	 * Event handler: Call this function when we no longer hover over the notification area
	 */
	private onMouseout(): void {
		if ( this.config.behaviour.pauseOnMouseover || this.config.behaviour.resetOnMouseover ) {
			this.runTimer();
		}
	}

	/**
	 * Event handler: Call this function when we click on the notification
	 */
	private onClick(): void {
		if ( this.config.behaviour.dismissOnClick ) {
			this.onDismiss();
		}
	}

	/* tslint:enable:no-unused-variable */

}
