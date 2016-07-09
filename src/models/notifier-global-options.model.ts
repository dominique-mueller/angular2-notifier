/**
 * Notifier global options interface
 */
export interface NotifierGlobalOptions extends Object {

	/**
	 * Animations
	 */
	animations?: {
		clear?: {
			offset?: number|boolean;
		};
		enabled?: boolean;
		hide?: {
			duration?: number;
			easing?: string;
			method?: string;
		};
		shift?: {
			duration?: number;
			easing?: string;
		};
		show?: {
			duration?: number;
			easing?: string;
			method?: string;
		};
	};

	/**
	 * Behaviour
	 */
	behaviour?: {
		autoHide?: number|boolean;
		dismissOnClick?: boolean;
		pauseOnMouseover?: boolean;
		resetOnMouseover?: boolean;
		showDismissButton?: boolean;
		stacking?: number|boolean;
	};

	/**
	 * Notification position
	 */
	position?: {
		gap?: number;
		horizontal?: {
			distance?: number;
			position?: string;
		};
		vertical?: {
			distance?: number;
			position?: string;
		};
	};

	/**
	 * Notification theme (class)
	 */
	theme?: string;

}
