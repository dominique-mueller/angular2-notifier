/**
 * Imports
 */
import { bootstrap } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';

// Go for it!
bootstrap( AppComponent )
	.then( ( data: any ) => {
		console.log( 'Application bootstrap successfully finished.' );
	} )
	.catch( ( error: any ) => {
		console.log( 'An erorr occured while bootstraping this application.' );
		console.error( error );
	} );
