/**
 * External imports
 */
import { bootstrap } from '@angular/platform-browser-dynamic';

/**
 * Internal imports
 */
import { NotifierGlobalOptions, provideNotifierOptions } from '../';
import { AppComponent } from './app.component';

/**
 * Custom notifier options (in this case the default ones)
 */
const myNotifierOptions: NotifierGlobalOptions = {
	animations: {
		clear: {
			offset: 50
		},
		enabled: true,
		hide: {
			duration: 300,
			easing: 'ease',
			method: 'fade'
		},
		shift: {
			duration: 300,
			easing: 'ease'
		},
		show: {
			duration: 300,
			easing: 'ease',
			method: 'slide'
		}
	},
	behaviour: {
		autoHide: false,
		dismissOnClick: false,
		pauseOnMouseover: true,
		resetOnMouseover: false,
		showDismissButton: true,
		stacking: 4
	},
	position: {
		gap: 10,
		horizontal: {
			distance: 12,
			position: 'left'
		},
		vertical: {
			distance: 12,
			position: 'bottom'
		}
	},
	theme: 'material'
};

// Go for it!
bootstrap( AppComponent, [
		provideNotifierOptions( myNotifierOptions )
	] )
	.then( ( data: any ) => {
		console.log( 'Application bootstrap successfully finished.' );
	} )
	.catch( ( error: any ) => {
		console.log( 'An erorr occured while bootstraping this application.' );
		console.error( error );
	} );
