/**
 * External imports
 */
import { ApplicationRef, ComponentFactory, ComponentRef, ComponentResolver, Injectable,
	ViewContainerRef } from '@angular/core';
import { ViewContainerRef_ } from '@angular/core/src/linker/view_container_ref';

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
	 * Component resolver
	 */
	private componentResolver: ComponentResolver;

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

		this.componentResolver = componentResolver;

		// Dynamically add our notifier container component into the document, next to the app component
		// In the case we use this service in the root component, we first need to wait until the bootstrap is done
		// Inspired by awesome people and their ideas on:
		// <http://stackoverflow.com/questions/34970778/get-root-component-elementref-or-componentref-angular-2>
		if ( ( <any> applicationRef )[ '_rootComponents' ].length === 0 ) {
			applicationRef.registerBootstrapListener( ( rootComponentRef: ComponentRef<any> ) => {
				this.setupComponent( rootComponentRef );
			} );
		} else {
			this.setupComponent( ( <any> applicationRef )[ '_rootComponents' ][ 0 ] );
		}

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

	/**
	 * Setup the notifier container component
	 * @param {ComponentRef<any>} rootComponent Root component of the application
	 */
	private setupComponent( rootComponent: ComponentRef<any> ): void {

		// Create the view container manually
		const rootContainer: ViewContainerRef = new ViewContainerRef_( ( <any> rootComponent )[ '_hostElement' ] );

		// Inject our component into the document, save its reference for later
		this.componentResolver
			.resolveComponent( NotifierContainerComponent )
			.then( ( componentFactory: ComponentFactory<NotifierContainerComponent> ) => {
				this.notifierContainer = rootContainer
					.createComponent<NotifierContainerComponent>( componentFactory, rootContainer.length,
						rootContainer.parentInjector )
					.instance;
			} );

	}

}
