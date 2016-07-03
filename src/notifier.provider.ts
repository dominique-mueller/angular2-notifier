/**
 * External imports
 */
import { Provider } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierOptions } from './models/notifier-options-global.model';

/**
 * Provide custom notifier options - TODO
 */
export function provideNotifierOptions( options: any ): Object {
	return {
		provide: NotifierOptions,
		useValue: new NotifierOptions( options )
	};
}
