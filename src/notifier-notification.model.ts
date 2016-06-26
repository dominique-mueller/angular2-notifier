/**
 * Notification model
 */
export class NotifierNotification {

	/**
	 * Notification type
	 */
	private type: string;

	/**
	 * Notification message
	 */
	private message: string;

	/**
	 * Constructor
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	constructor( type: string, message: string ) {
		this.type = type;
		this.message = message;
	}

}
