/**
 * Imports
 */
import { Injectable, ApplicationRef, ElementRef, ComponentRef, ViewContainerRef, ComponentResolver, ComponentFactory } from '@angular/core';
import { ViewContainerRef_ } from '@angular/core/src/linker/view_container_ref';
import { ComponentRef_ } from '@angular/core/src/linker/component_factory';
import { Notification } from './notification.model.ts';
import { NotifierContainerComponent } from './notifier-container.component';

/**
 * Notifier service
 */
@Injectable()
export class NotifierService {

	/**
	 * Reference to the notifier container component
	 */
	private notifierContainerRef: ComponentRef<NotifierContainerComponent>;

	/**
	 * Constructor
	 * @param {ApplicationRef}    applicationRef    Angular application reference
	 * @param {ComponentResolver} componentResolver Component resolver (instead of dynamic component loader)
	 */
	constructor( applicationRef: ApplicationRef, componentResolver: ComponentResolver ) {

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
					this.notifierContainerRef = rootComponent.createComponent<NotifierContainerComponent>
						(componentFactory, rootComponent.length, rootComponent.parentInjector );
				} );

		} );

	}



	public info( message: string ) {
		let test = 'true';
		console.log('Notification');
		console.log(message);
	}

}
