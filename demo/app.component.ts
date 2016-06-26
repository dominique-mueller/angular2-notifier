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
		NotifierService,
		provideNotifierOptions( {
			autoHide: 5000
		} )
	],
	selector: 'x-app',
	templateUrl: './app.component.html',
} )
export class AppComponent {

	/**
	 * Notifier service reference
	 */
	private notifier: NotifierService;

	/**
	 * Constructor
	 * @param {NotifierService} notifier Notifier service
	 */
	constructor( notifier: NotifierService ) {
		this.notifier = notifier;
	}

	private test() {
		this.notifier.info( 'This is a test.' );
	}

}
