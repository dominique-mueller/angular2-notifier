/**
 * External imports
 */
import { ApplicationRef, ComponentFactory, ComponentResolver, Injectable, ViewContainerRef } from '@angular/core';
import { ViewContainerRef_ } from '@angular/core/src/linker/view_container_ref';
import { ComponentRef_ } from '@angular/core/src/linker/component_factory';

/**
 * Internal imports
 */
import { NotifierNotification } from './../models/notifier-notification.model';
import { SHOW, CLEAR_ALL, CLEAR_NEWEST, CLEAR_OLDEST } from './../models/notifier-action.model';
import { NotifierContainerComponent } from './../components/notifier-container.component';

/**
 * Notifier service
 * This service works as the public API of this library, and also like a bridge between the components
 */
@Injectable()
export class NotifierService {

	/**
	 * Notifier component
	 */
	private notifierContainer: NotifierContainerComponent;

	/**
	 * Constructor
	 * @param {ApplicationRef}    applicationRef    Application
	 * @param {ComponentResolver} componentResolver Component resolver
	 */
	public constructor( applicationRef: ApplicationRef, componentResolver: ComponentResolver ) {

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
					this.notifierContainer = rootComponent
						.createComponent<NotifierContainerComponent>( componentFactory, rootComponent.length,
							rootComponent.parentInjector )
						.instance;
				} );

		} );

	}

	/**
	 * Show a notification (the general way)
	 * @param  {string}       type    Notification type
	 * @param  {string}       message Notification message
	 * @return {Promise<any>}         Promise, resolved when finished
	 */
	public notify( type: string, message: string ): Promise<any> {
		return this.notifierContainer.doAction( {
			payload: new NotifierNotification( type, message ),
			type: SHOW
		} );
	}

	/**
	 * Show a default notification (the specific way)
	 * @param  {string}       message Notification message
	 * @return {Promise<any>}         Promise, resolved when finished
	 */
	public default( message: string ): Promise<any> {
		return this.notify( 'default', message );
	}

	/**
	 * Show a info notification (the specific way)
	 * @param  {string}       message Notification message
	 * @return {Promise<any>}         Promise, resolved when finished
	 */
	public info( message: string ): Promise<any> {
		return this.notify( 'info', message );
	}

	/**
	 * Show a success notification (the specific way)
	 * @param  {string}       message Notification message
	 * @return {Promise<any>}         Promise, resolved when finished
	 */
	public success( message: string ): Promise<any> {
		return this.notify( 'success', message );
	}

	/**
	 * Show a warning notification (the specific way)
	 * @param  {string}       message Notification message
	 * @return {Promise<any>}         Promise, resolved when finished
	 */
	public warning( message: string ): Promise<any> {
		return this.notify( 'warning', message );
	}

	/**
	 * Show a error notification (the specific way)
	 * @param  {string}       message Notification message
	 * @return {Promise<any>}         Promise, resolved when finished
	 */
	public error( message: string ): Promise<any> {
		return this.notify( 'error', message );
	}

	/**
	 * Clear all notifications
	 * @return {Promise<any>} Promise, resolved when finished
	 */
	public clearAll(): Promise<any> {
		return this.notifierContainer.doAction( {
			type: CLEAR_ALL
		} );
	}

	/**
	 * Clear the oldest notification
	 * @return {Promise<any>} Promise, resolved when finished
	 */
	public clearOldest(): Promise<any> {
		return this.notifierContainer.doAction( {
			type: CLEAR_OLDEST
		} );
	}

	/**
	 * Clear then newest notification
	 * @return {Promise<any>} Promise, resolved when finished
	 */
	public clearNewest(): Promise<any> {
		return this.notifierContainer.doAction( {
			type: CLEAR_NEWEST
		} );
	}

}
