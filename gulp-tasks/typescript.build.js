'use strict';

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const browserSync = require( 'browser-sync' );
const typescript = require( 'gulp-typescript' );

/**
 * Gulp task: Build TypeScript for demo
 */
gulp.task( 'typescript:build:demo', () => {

	return gulp

		// Get our files, including all external definitions
		.src( [
			'./demo/*.ts',
			'./typings/index.d.ts'
		] )

		// Compile TypeScript into JavaScript, depending on our configuration
		.pipe(
			typescript( typescript.createProject( './tsconfig.json' ) ), // Absolute path
			undefined,
			typescript.reporter.fullReporter()
		)

		// Save result, speak with browser-sync
		.pipe( gulp.dest( './demo' ) )
		.pipe( browserSync.stream( { once: true } ) );

} );
