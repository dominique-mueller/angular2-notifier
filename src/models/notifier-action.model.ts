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

/**
 * Defined notifier actions
 */
export const SHOW: string = 'SHOW';
export const HIDE: string = 'HIDE';
export const CLEAR_ALL: string = 'CLEAR_ALL';
export const CLEAR_NEWEST: string = 'CLEAR_NEWEST';
export const CLEAR_OLDEST: string = 'CLEAR_OLDEST';
