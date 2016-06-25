/**
 * Imports
 */
import { Component } from '@angular/core';
import { NotifierService } from '../';

/**
 * App component
 */
@Component( {
	providers: [
		NotifierService
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
		console.log( 'Should notify now ...' );
		this.notifier.info( 'This is a test.' );
	}

}
