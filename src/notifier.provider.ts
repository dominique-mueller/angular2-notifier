/**
 * External imports
 */
import { Provider } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierOptions } from './notifier-options.model';

/**
 * Provide custom notifier options
 * @param  {any}      options Custom notifier options - TODO: Type (interface?)
 * @return {Provider}         Provider
 */
export function provideNotifierOptions( options: any ): Provider {
	return new Provider( NotifierOptions, {
		useValue: new NotifierOptions( options )
	} );
}
