'use strict';

/**
 * Gulp imports
 */
const browserSync = require( 'browser-sync' );
// const Builder = require( 'systemjs-builder' );
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const typescript = require( 'gulp-typescript' );
const webpack = require( 'webpack' );

/**
 * Gulp task: Compile each project TypeScript file into a JavaScript file
 */
gulp.task( 'typescript:build--single', () => {
	return gulp
		.src( [ // Keep the folder structure alive
			'./**/*.ts',
			'./typings/index.d.ts',
			'!./demo/**/*',
			'!./node_modules/**/*'
		] )
		.pipe(
			typescript( typescript.createProject( './tsconfig.json' ) ), // Absolute path
			undefined,
			typescript.reporter.fullReporter()
		)
		.pipe( gulp.dest( './' ) ) // Same folder structure
		.pipe( browserSync.stream( { once: true } ) );
} );



/**
 * Bundle TypeScript
 */
gulp.task( 'typescript:build--bundle',
	gulp.series( [
		'typescript:build--single',
		( done ) => {

			// const builder = new Builder();

			// builder.config( {
			// 	baseURL: './',
			// 	map: {
			// 		'angular2-notifier': '', // Our library
			// 		'@angular': 'node_modules/@angular' // Angular dependency
			// 	},
			// 	meta: {
			// 		'node_modules/*': {
			// 			build: false // Don't bundle dependencies
			// 		}
			// 	},
				// packages: {
					// 'angular2-notifier': {
					// 	defaultExtension: 'js',
					// 	main: 'index'
					// }
					// '@angular/core': {
					// 	defaultExtension: 'js',
					// 	main: 'index.js'
					// },
				// }
			// 	paths: {
			// 		'*': '*.js'
			// 	}
			// } );

			// builder.buildStatic( 'index', './bundles/angular2-notifier.bundle.js', { runtime: false } )
			// 	.then( () => {
			// 		gutil.log( 'Build complete.' );
			// 	} )
			// 	.catch( ( error ) => {
			// 		console.log( 'Build error.', error );
			// 	} );

			// builder.bundle( './index.js', './bundles/angular2-notifier.bundle.min.js', {
			// 	minify: true
			// } )
			// 	.then( () => {
			// 		gutil.log( 'Build complete.' );
			// 	} )
			// 	.catch( ( error ) => {
			// 		console.log( 'Build error.', error );
			// 	} );



			// webpack( {
			// 	entry: './index',
			// 	output: {
			// 		path: './bundles',
			// 		filename: 'angular2-notifier.bundle.js',
			// 		libraryTarget: 'umd'
			// 	},
			// 	resolve: {
			// 		extensions: [ '.js' ]
			// 	},
			// 	plugins: [
			// 		new webpack.optimize.DedupePlugin(), // Remove duplicates
			// 		// new webpack.IgnorePlugin( /@angular\/core/ ) // Ignore dependencies, just bundle the library
			// 	]
			// }, ( error, stats ) => {
			// 	if( error ) {
			// 		throw new gutil.PluginError( 'webpack', error );
			// 	}
			// 	gutil.log( stats.toString( {
			// 		colors: true,
			// 		chunks: false
			// 	} ) );
			// 	done();
			// } );

		}
	] )
);




/**
 * Gulp task: Compile each demo TypeScript file into a JavaScript file
 */
gulp.task( 'typescript:build--demo', () => {
	return gulp
		.src( [
			'./demo/*.ts',
			'./typings/index.d.ts'
		] )
		.pipe(
			typescript( typescript.createProject( './tsconfig.json' ) ), // Absolute path
			undefined,
			typescript.reporter.fullReporter()
		)
		.pipe( gulp.dest( './demo' ) )
		.pipe( browserSync.stream( { once: true } ) );
} );
