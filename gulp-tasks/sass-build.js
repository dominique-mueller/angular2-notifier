'use strict';

/**
 * Gulp imports
 */
const autoprefixer = require( 'gulp-autoprefixer' );
const browserSync = require( 'browser-sync' );
const cleanCss = require( 'gulp-clean-css' );
const gulp = require( 'gulp' );
const rename = require( 'gulp-rename' );
const sass = require( 'gulp-sass' );

/**
 * Gulp task: Compile each project SASS file into a CSS file
 */
gulp.task( 'sass:build--single', () => {
	return gulp
		.src( [
			'./styles/**/*.scss' // Each single file
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

/**
 * Gulp task: Build SASS as bundle
 */
gulp.task( 'sass:build--bundle',
	gulp.series( [
		'sass:build--single',
		() => {
			return gulp
				.src( [
					'./styles/style.css' // Use the already compiled file here
				] )
				.pipe( rename( 'style.bundle.css' ) )
				.pipe( gulp.dest( './bundles' ) )
				.pipe( cleanCss() ) // Minify
				.pipe( rename( 'style.bundle.min.css' ) )
				.pipe( gulp.dest( './bundles' ) )
				.pipe( browserSync.stream( { once: true } ) );
		}
	] )
);
