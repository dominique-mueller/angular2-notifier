/**
 * External imports
 */
import { Component, Input, Optional, AfterViewInit, ElementRef, Renderer } from '@angular/core';

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
		// '[attr.class]': 'classMap',
		// '[ngClass]': '{ \'is-visible\': isVisible }'
		// '[ngStyle]': 'customStyles'
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

	/**
	 * Rederer reference, e.g. for the DOM
	 */
	private renderer: Renderer;

	/**
	 * Notifier options
	 */
	private options: NotifierOptions;

	/**
	 * Custom CSS classes, depending on notifier options
	 */
	private classMap: string;

	/**
	 * Reference to this component
	 */
	public elementRef: ElementRef;

	private isVisible: boolean;

	/**
	 * Constructor
	 * @param {NotifierOptions} @Optional() notifierOptions Custom notifier options
	 */
	constructor( @Optional() notifierOptions: NotifierOptions, elementRef: ElementRef, renderer: Renderer ) {

		// Initialize
		this.renderer = renderer;

		// Use custom notifier options if present
		this.options = notifierOptions === null ? new NotifierOptions() : notifierOptions;
		this.elementRef = elementRef;


		switch ( this.options.position[ 0 ] ) {
			case 'left':
				this.renderer.setElementStyle( this.elementRef.nativeElement, 'left', `${ this.options.distances[ 0 ] }px` );
				break;
			case 'right':
				this.renderer.setElementStyle( this.elementRef.nativeElement, 'right', `${ this.options.distances[ 0 ] }px` );
				break;
			default:
				break;
		}
		switch ( this.options.position[ 1 ] ) {
			case 'top':
				this.renderer.setElementStyle( this.elementRef.nativeElement, 'top', `${ this.options.distances[ 1 ] }px` );
				break;
			case 'bottom':
				this.renderer.setElementStyle( this.elementRef.nativeElement, 'bottom', `${ this.options.distances[ 1 ] }px` );
				break;
			default:
				break;
		}

		this.renderer.setElementStyle( this.elementRef.nativeElement, 'opacity', '0' );

		this.renderer.setElementClass( this.elementRef.nativeElement, `x-notifier__notification--${ this.options.theme }`, true );
		this.renderer.setElementClass( this.elementRef.nativeElement, `x-notifier__notification--${ this.options.animation }`, true );

		// console.log('******');
		// console.log(elementRef.nativeElement.offsetHeight);

		this.isVisible = false;

	}

	public ngAfterViewInit(): void {

		// console.log('*******');
		// console.log(this.elementRef.nativeElement.offsetHeight);

	}

	public animateIn(): void {
		// this.renderer.setElementClass( this.elementRef.nativeElement, `x-notifier__notification--visible`, true );

		let animation: any = this.elementRef.nativeElement.animate(
			[ // TODO: Shorter version?
				{ // From ...
					opacity: 0,
					transform: 'translateX( -120% )'
				},
				{ // To ...
					opacity: 1,
					transform: 'translateX( 0 )'
				}
			],
			{
				duration: 400, // Duration in ms
				easing: 'ease-out',
				fill: 'forwards' // Keep position after paint
			}
		);

	}

}
