/**
 * External imports
 */
import { Component } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierService } from '../';

/**
 * App (root) component
 */
@Component( {
	host: {
		class: 'x-app'
	},
	providers: [
		NotifierService
	],
	selector: 'x-app',
	template: `
		<h1>angular2-notifier: Demo</h1>

		<h2>Show notifications</h2>
		<button class="button button--primary" type="button" (click)="show( 'default' )">
			Default me!
		</button>
		<button class="button button--primary" type="button" (click)="show( 'info' )">
			Info me!
		</button>
		<button class="button button--primary" type="button" (click)="show( 'success' )">
			Success me!
		</button>
		<button class="button button--primary" type="button" (click)="show( 'warning' )">
			Warning me!
		</button>
		<button class="button button--primary" type="button" (click)="show( 'error' )">
			Error me!
		</button>

		<h2>Clear notifications</h2>
		<button class="button button--secondary" type="button" (click)="clearAll()">
			Clear all notifications!
		</button>
		<button class="button button--secondary" type="button" (click)="clearNewest()">
			Clear newest notification!
		</button>
		<button class="button button--secondary" type="button" (click)="clearOldest()">
			Clear oldest notification!
		</button>
	`
} )
export class AppComponent {

	/**
	 * Notifier service
	 */
	private notifier: NotifierService;

	/**
	 * Notification counter
	 */
	private counter: number;

	/**
	 * Constructor
	 * @param {NotifierService} notifier Notifier service
	 */
	public constructor( notifier: NotifierService ) {
		this.notifier = notifier;
		this.counter = 0;
	}

	/**
	 * Show a notification
	 * @param {string} type Notification type
	 */
	private show( type: string ): void {
		switch ( type ) {
			case 'default':
				console.log( `# Showing default notification, #${ this.counter }.` );
				this.notifier.default( 'Welcome back, you lovely person!' ).then( () => {
					console.log( '# Default notification opened.' );
				} );
				break;
			case 'info':
				console.log( `# Showing info notification, #${ this.counter }.` );
				this.notifier.info( 'This library is build on top of Angular 2.' ).then( () => {
					console.log( '# Info notification opened.' );
				} );
				break;
			case 'success':
				console.log( `# Showing success notification, #${ this.counter }.` );
				this.notifier.success( 'Notification successfully opened.' ).then( () => {
					console.log( '# Success notification opened.' );
				} );
				break;
			case 'warning':
				console.log( `# Showing warning notification, #${ this.counter }.` );
				this.notifier.warning( 'But be warned: Angular 2 is still RC.' ).then( () => {
					console.log( '# Warning notification opened.' );
				} );
				break;
			case 'error':
				console.log( `# Showing error notification, #${ this.counter }.` );
				this.notifier.error( 'Whoops, something went wrong. Not.' ).then( () => {
					console.log( '# Error notification opened.' );
				} );
				break;
		}
		this.counter++;
	}

	/**
	 * Clear all notificaitons
	 */
	private clearAll(): void {
		console.log('# Clearing all notifications ...');
		this.notifier.clearAll().then( () => {
			console.log('# All notifications cleared.');
		} );
	}

	/**
	 * Clear oldest notification
	 */
	private clearOldest(): void {
		console.log('# Clearing the oldest notification ...');
		this.notifier.clearOldest().then( () => {
			console.log('# Oldest notification cleared.');
		} );
	}

	/**
	 * Clear newest notification
	 */
	private clearNewest(): void {
		console.log('# Clearing the newest notification ...');
		this.notifier.clearNewest().then( () => {
			console.log('# Newest notification cleared.');
		} );
	}

}
