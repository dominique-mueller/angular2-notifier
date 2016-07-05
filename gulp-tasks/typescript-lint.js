'use strict';

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const tslint = require( 'gulp-tslint' );

/**
 * Gulp task: Lint all TypeScript files
 */
gulp.task( 'typescript:lint', () => {
	return gulp
		.src( [
			'./src/**/*.ts'
		] )
		.pipe( tslint() )
		.pipe( tslint.report( 'verbose' ) );
} );
