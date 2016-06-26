/**
 * External imports
 */
import { Component, Input, Optional, AfterViewInit, ElementRef } from '@angular/core';

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
		'[attr.class]': 'classMap'
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
	private elementRef: ElementRef;

	/**
	 * Constructor
	 * @param {NotifierOptions} @Optional() notifierOptions Custom notifier options
	 */
	constructor( @Optional() notifierOptions: NotifierOptions, elementRef: ElementRef ) {

		// Use custom notifier options if present
		this.options = notifierOptions === null ? new NotifierOptions() : notifierOptions;
		this.classMap = [
			'x-notifier__notification',
			`x-notifier__notification--${ this.options.position }`,
			`x-notifier__notification--${ this.options.theme }`
		].join( ' ' );

		// console.log('******');
		// console.log(elementRef.nativeElement.offsetHeight);

		this.elementRef = elementRef;

	}

	public ngAfterViewInit(): void {

		// console.log('*******');
		// console.log(this.elementRef.nativeElement.offsetHeight);

	}

	/**
	 * Get / calculate the current height
	 */
	public getElementRef(): ElementRef {
		return this.elementRef;
	}

}
