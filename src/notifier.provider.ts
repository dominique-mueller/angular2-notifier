/**
 * Internal imports
 */
import { NotifierGlobalConfig } from './models/notifier-global-config.model';
import { NotifierGlobalOptions } from './models/notifier-global-options.model';

/**
 * Set global config by providing custom notifier options
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
