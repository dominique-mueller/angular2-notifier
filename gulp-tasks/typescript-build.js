'use strict';

/**
 * Gulp imports
 */
const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const typescript = require( 'gulp-typescript' );

/**
 * Gulp task: Compile all TypeScript files into JavaScript
 */
gulp.task( 'typescript:build', () => {
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
