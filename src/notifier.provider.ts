/**
 * External imports
 */
import { Provider } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierOptions } from './notifier-options.model';

/**
 * Provide custom notifier options - TODO
 */
export function provideNotifierOptions( options: any ): Object {
	return {
		provide: NotifierOptions,
		useValue: new NotifierOptions( options )
	};
}
