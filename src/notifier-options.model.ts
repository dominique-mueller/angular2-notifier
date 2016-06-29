/**
 * External imports
 */
import { Injectable } from '@angular/core';

/**
 * Notification options model
 * TODO: Description
 */
@Injectable()
export class NotifierOptions { // TODO: Global & local ones

	/**
	 * Notification design theme
	 * -------------------------
	 * - This value (string) will be maped to a special class name, the class will be added to all notifications.
	 * - The naming convention follows the 'x-notifier__notification--[theme]' principle.
	 * - Themes should be provided as CSS rules / files (default ones exist)
	 * > Default value: 'material'
	 */
	public theme: string;

	/**
	 * Notification position
	 * ---------------------
	 * - The first value (string) defines the horizontal position (x-axis), e.g. 'left', 'middle', 'right'.
	 * - The second value (string) defines the vertical position (y-axis), e.g. 'top', 'bottom'.
	 * > Default value: [ 'left', 'bottom' ]
	 */
	public position: Array<string>;

	/**
	 * Notification distances
	 * ----------------------
	 * - The first value (number) defines the horizontal distance (x-axis), in px.
	 * - The second value (number) defines the vertical distance (y-axis), in px.
	 * - The third value (number) defines the vertical distance between notifications (y-axis), in px.
	 * > Default value: [ 10, 10, 10 ]
	 */
	public distances: Array<number>;

	/**
	 * Auto hide
	 * ---------
	 * - If set to false, the notification won't dismiss itself automatically.
	 * - If set to a number, the notification will dismiss itself when the value (in ms) has timed out.
	 * > Default value: 5000
	 */
	public autoHide: boolean|number;

	/**
	 * Show dismiss button
	 * -------------------
	 * - Enable / disable a button (showing an 'X'), which dismissed the notification when being clicked.
	 * > Default value: true
	 */
	public showDismissButton: boolean;

	/**
	 * Stacking
	 * --------
	 * - If set to false, stacking is disabled, so only one notification is visible at a time.
	 * - A positive number acts as the maximum limit of notifications which can be opened simulatniously.
	 * - In general we show only as many notifications as there is place on the screen
	 * > Default value: 3
	 */
	public stacking: boolean|number;

	/**
	 * On Mouseover
	 * ------------
	 * - If set to false, nothing will happen on mouseover at all.
	 * - If set to 'pause', the autoHide timer will pause as long as the mouse is over the notification.
	 * - If set to 'reset', the autoHide timer will be reset in the moment the mouse enters the notification area.
	 * > Default value: false
	 */
	public onMouseover: boolean|string;

	// TODO: Animations for 'in', 'out' & 'shift' + PRESETS

	/**
	 * Constructor
	 * @param {any = {}} options Custom options, default options as fallback
	 */
	constructor( options: Object = {
		autoHide: false,
		distances: [ 10, 10, 10 ],
		onMouseover: false,
		position: [ 'left', 'bottom' ],
		showDismissButton: true,
		stacking: 3,
		theme: 'material'
	} ) {
		Object.assign( this, options ); // Merge
	}

}
