/**
 * Internal imports
 */
import { NotifierNotificationComponent } from './../components/notifier-notification.component';

/**
 * Notification model
 */
export class NotifierNotification extends Object {

	/**
	 * Notification type
	 * Note: This string maps to a class name, e.g. 'success' maps to '.x-notifier__notification--success'
	 */
	public type: string;

	/**
	 * Notification message (string only for now, HTML templates may come in the future)
	 */
	public message: string;

	/**
	 * Component reference (will be set when component gets initialized)
	 */
	public component: NotifierNotificationComponent;

	/**
	 * Constructot
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	public constructor( type: string, message: string ) {
		super();
		this.type = type;
		this.message = message;
		this.component = null;
	}

}
