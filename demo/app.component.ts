/**
 * Imports
 */
import { Component } from '@angular/core';
import { NotifierService, NotifierOptions, provideNotifierOptions } from '../';

/**
 * App component
 */
@Component( {
	providers: [
		NotifierService
		// provideNotifierOptions()
	],
	selector: 'x-app',
	templateUrl: './app.component.html'
} )
export class AppComponent {

	/**
	 * Notifier service reference
	 */
	private notifier: NotifierService;

	private index: number = 0; // TODO: Remove me

	/**
	 * Constructor
	 * @param {NotifierService} notifier Notifier service
	 */
	constructor( notifier: NotifierService ) {
		this.notifier = notifier;
	}

	private test(): void {
		this.notifier.info( 'This is notification #' + this.index );
		this.index++;
	}

	private test2(): void {
		this.notifier.remove();
	}

}
