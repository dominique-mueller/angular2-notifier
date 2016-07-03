/**
 * External imports
 */
import { Provider } from '@angular/core';

/**
 * Internal imports
 */
import { NotifierGlobalConfig } from './models/notifier-global-config.model';
import { NotifierGlobalOptions } from './models/notifier-global-options.model';

/**
 * Provide custom notifier options (TODO)
 */
export function provideNotifierOptions( options: NotifierGlobalOptions ): {
	provide: typeof NotifierGlobalConfig;
	useValue: NotifierGlobalConfig;
} {
	return {
		provide: NotifierGlobalConfig,
		useValue: new NotifierGlobalConfig( options ) // This merges the default options with the custom ones
	};
}
