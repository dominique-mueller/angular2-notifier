/**
 * Notifier animation, follows the Web Animations API syntax
 */
export interface NotifierAnimation extends Object {

	/**
	 * Animation keyframes; first entry is 'from', second entry is 'to'
	 */
	keyframes: Array<any>;

	/**
	 * Animation options
	 */
	options: {

		/**
		 * Animation delay, in ms
		 */
		delay: number;

		/**
		 * Animation duration, in ms
		 */
		duration: number;

		/**
		 * Animation easing (compare CSS easing methods)
		 */
		easing: string;

		/**
		 * Animation fill mode
		 */
		fill: string;

	};

}
