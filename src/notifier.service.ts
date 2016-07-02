/**
 * External imports
 */
import { Injectable, ApplicationRef, ComponentRef, ViewContainerRef, ComponentResolver,
	ComponentFactory, Optional } from '@angular/core';
import { ViewContainerRef_ } from '@angular/core/src/linker/view_container_ref';
import { ComponentRef_ } from '@angular/core/src/linker/component_factory';

/**
 * Internal imports
 */
import { NotifierNotification } from './notifier-notification.model';
import { NotifierOptions } from './notifier-options.model';
import { NotifierContainerComponent } from './notifier-container.component';

/**
 * Notifier service
 * TODO: Description
 */
@Injectable()
export class NotifierService {

	/**
	 * Reference to the notifier container component
	 */
	private notifierContainer: NotifierContainerComponent;

	/**
	 * Constructor
	 * @param {ApplicationRef}    applicationRef    Angular application reference
	 * @param {ComponentResolver} componentResolver Component resolver (instead of dynamic component loader)
	 */
	constructor( applicationRef: ApplicationRef, componentResolver: ComponentResolver,
		@Optional() notifierOptions: NotifierOptions ) {

		// notifierOptions === null when they are not provided explicetely
		// TODO: Save custom options

		console.log( '### NOTIFIER OPTIONS' );
		console.log( notifierOptions );


		// Dynamically add our notifier container into the document, after app bootstrap finished
		// Inspired by the <https://github.com/valor-software/ng2-bootstrap/> components helper service
		applicationRef.registerBootstrapListener( ( rootComponentRef: ComponentRef_<any> ) => {

			// Get the app root component (in a kind of hacky way, I know ...)
			// See <https://github.com/angular/angular/issues/6446> for more details
			const rootComponent: ViewContainerRef = new ViewContainerRef_( rootComponentRef[ '_hostElement' ] );

			// Inject our component into the document, save its reference for later
			componentResolver
				.resolveComponent( NotifierContainerComponent )
				.then( ( componentFactory: ComponentFactory<NotifierContainerComponent> ) => {
					this.notifierContainer = rootComponent .createComponent<NotifierContainerComponent>(
						componentFactory, rootComponent.length, rootComponent.parentInjector ).instance;
				} );

		} );

	}

	public notify( type: string, message: string, options?: Object ): void { // TODO: Options type
		this.notifierContainer.addNotification( new NotifierNotification( type, message ) );
	}

	// TODO: TEST
	// public info( message: string ) {
	// 	console.log( 'Info notification requested ...' ); // TODO
	// 	const notification = new NotifierNotification( 'info', message );
	// 	this.notifierContainer.addNotification( notification );
	// }

	// TODO: Global event listeners as Observables

}
