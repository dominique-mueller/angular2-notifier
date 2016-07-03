/**
 * External imports
 */
import { ApplicationRef, ComponentFactory, ComponentRef, ComponentMetadata, ComponentResolver, Component, Inject, Injectable, Optional,
	ReflectiveInjector, ViewContainerRef } from '@angular/core';
import { ViewContainerRef_ } from '@angular/core/src/linker/view_container_ref';
import { ComponentRef_ } from '@angular/core/src/linker/component_factory';

/**
 * Internal imports
 */
import { NotifierNotification } from './../models/notifier-notification.model';
import { NotifierContainerComponent } from './../components/notifier-container.component';

/**
 * Notifier service (TODO)
 */
@Injectable()
export class NotifierService {

	/**
	 * Internal: Notifier component
	 */
	private notifierContainer: NotifierContainerComponent;

	/**
	 * Constructor, sets up global configuration and loads the notifier container component into the app
	 * @param {ApplicationRef}       applicationRef       Application
	 * @param {ComponentResolver}    componentResolver    Component resolver
	 * @param {NotifierGlobalConfig} notifierGlobalConfig Global notifier config, coming from provider
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
	 * General way to show a new notification
	 */
	public notify( type: string, message: string ): void {
		this.notifierContainer.addNotification( new NotifierNotification( type, message ) );
	}

	/**
	 * Short way to show a new info notification
	 */
	public info( message: string ): void {
		this.notifierContainer.addNotification( new NotifierNotification( 'info', message ) );
	}

	/**
	 * Short way to show a new success notification
	 */
	public success( message: string ): void {
		this.notifierContainer.addNotification( new NotifierNotification( 'success', message ) );
	}

	/**
	 * Short way to show a new warning notification
	 */
	public warning( message: string ): void {
		this.notifierContainer.addNotification( new NotifierNotification( 'warning', message ) );
	}

	/**
	 * Short way to show a new error notification
	 */
	public error( message: string ): void {
		this.notifierContainer.addNotification( new NotifierNotification( 'error', message ) );
	}

	/**
	 * Clear all notifications
	 */
	public clearAll(): void {
		this.notifierContainer.removeAllNotifications();
	}

	/**
	 * Clear oldest notification
	 */
	public clearOldest(): void {
		this.notifierContainer.removeFirstNotification();
	}

	/**
	 * Clear newest notification
	 */
	public clearNewest(): void {
		this.notifierContainer.removeLastNotification();
	}

	// TODO: Local notification options
	// TODO: Global event listeners as Observables

}
