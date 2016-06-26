'use strict';

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const browserSync = require( 'browser-sync' );
const typescript = require( 'gulp-typescript' );

/**
 * Gulp task: Compile each TypeScript file into a JavaScript file
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
 * Gulp task: Compile the TypeScript demo project into JavaScript
 */
gulp.task( 'typescript:build--demo', () => {

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
