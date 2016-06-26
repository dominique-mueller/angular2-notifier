'use strict';

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const browserSync = require( 'browser-sync' );
const autoprefixer = require( 'gulp-autoprefixer' );
const sass = require( 'gulp-sass' );

/**
 * Gulp task: Compile each SASS file into a CSS file
 */
gulp.task( 'sass:build--single', () => {
	return gulp
		.src( [
			'./styles/**/*.scss' // Each single file
		] )
		.pipe(
			sass( {
				'errLogToConsole': true,
				'outputStyle': 'expanded'
			} ).on( 'error', sass.logError ) // Show errors
		)
		.pipe( autoprefixer( {
			'path': './../browserlist' // List of supported browsers
		} ) )
		.pipe( gulp.dest( './styles' ) ) // Same folder structure
		.pipe( browserSync.stream( { once: true } ) );
} );
