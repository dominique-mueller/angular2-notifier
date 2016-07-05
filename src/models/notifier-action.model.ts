/**
 * Notifier action
 */
export interface NotifierAction {
	type: string;
	payload?: any;
	resolve?: Function;
}
