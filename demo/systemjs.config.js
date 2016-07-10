'use strict';

/**
 * SystemJS configuration (for module loading)
 */
( function( window ) {

	// Tell SystemJS where to find our modules
	var map = {

		// App
		'app': './',

		// Libraries
		'@angular': './../node_modules/@angular',
		'rxjs': './../node_modules/rxjs',
		'../': './../'

	};

	// Tell SystemJS which files to load
	var packages = {

		// App
		'app': {
			defaultExtension: 'js',
			main: 'main.js'
		},

		// Libraries
		'@angular/common': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@angular/compiler': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@angular/core': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@angular/platform-browser': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'@angular/platform-browser-dynamic': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'../': {
			defaultExtension: 'js',
			main: 'index.js'
		},
		'rxjs': {
			defaultExtension: 'js'
		}

	};

	// Configure SystemJS
	System.config( {
		map: map,
		packages: packages
	} );

	// Run SystemJS
	System.import( 'app' ).catch( function( error ) {
		console.error( error );
	} );

} )( this );
