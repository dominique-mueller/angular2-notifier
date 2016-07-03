/**
 * Imports
 */
import { Component } from '@angular/core';
import { NotifierService, provideNotifierOptions } from '../';

/**
 * App component
 */
@Component( {
	providers: [
		NotifierService
		// provideNotifierOptions( {
		// 	position: {
		// 		horizontal: {
		// 			position: 'right'
		// 		}
		// 	}
		// } )
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

	private show(): void {
		this.notifier.notify( 'info', 'This is notification #' + this.index ).then( () => {
			console.log('>>> New notification added.');
		} );
		this.index++;
	}

	private clearAll(): void {
		this.notifier.clearAll().then( () => {
			console.log('>>> All notifications cleared.');
		} );
	}

	private clearOldest(): void {
		this.notifier.clearOldest().then( () => {
			console.log('>>> Oldest notification cleared.');
		} );
	}

	private clearNewest(): void {
		this.notifier.clearNewest().then( () => {
			console.log('>>> Newest notification cleared.');
		} );
	}

}
