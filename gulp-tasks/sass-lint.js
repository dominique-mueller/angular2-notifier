'use strict';

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const sassLint = require( 'gulp-sass-lint' );

/**
 * Gulp task: Lint all SASS files
 */
gulp.task( 'sass:lint', () => {
	return gulp
		.src( [
			'./styles/**/*.scss' // Each single file
		] )
		.pipe( sassLint() )
		.pipe( sassLint.format() ) // Pretty print results
		.pipe( sassLint.failOnError() ); // Let me know
} );
