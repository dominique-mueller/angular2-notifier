/**
 * Notifier action
 */
export interface NotifierAction extends Object {

	/**
	 * Notifier action type
	 */
	type: string;

	/**
	 * Notifier action payload
	 */
	payload?: any;

	/**
	 * Notifier action resolve function, used for resolving a Promise
	 */
	resolve?: Function;

}
