/**
 * Notifier global options interface
 */
export interface NotifierGlobalOptions extends Object {

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

	/**
	 * Behaviour
	 */
	behaviour?: {
		autoHide?: number|boolean;
		pauseOnMouseover?: boolean;
		resetOnMouseover?: boolean;
		dismissOnClick?: boolean;
		stacking?: number|boolean;
		showDismissButton?: boolean;
	};

	/**
	 * Animations
	 */
	animations?: {
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
		clear?: {
			offset?: number;
		};
	};

}
