'use strict';

/**
 * Gulp imports
 */
const autoprefixer = require( 'gulp-autoprefixer' );
const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );
const sass = require( 'gulp-sass' );

/**
 * Gulp task: Compile all SASS file into CSS
 */
gulp.task( 'sass:build', () => {
	return gulp
		.src( [
			'./styles/**/*.scss' // Each single file, including the entry point
		] )
		.pipe(
			sass( { // Compile
				'errLogToConsole': true,
				'outputStyle': 'expanded'
			} ).on( 'error', sass.logError ) // Show errors
		)
		.pipe( autoprefixer() ) // Autoprefix
		.pipe( gulp.dest( './styles' ) ) // Same folder structure
		.pipe( browserSync.stream( { once: true } ) );
} );
