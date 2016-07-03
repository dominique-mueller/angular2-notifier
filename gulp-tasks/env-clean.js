'use strict';

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const del = require( 'del' );

/**
 * Gulp: Clean build, includes JavaScript and CSS files
 */
gulp.task( 'env:clean--single', () => {
	return del( [
		'./index.js',
		'./src/**/*.js',
		'./styles/**/*.css'
	] );
} );

/**
 * Gulp: Clean the demo project build
 */
gulp.task( 'env:clean--demo', () => {
	return del( [
		'./demo/main.js',
		'./demo/app.component.js'
	] );
} );
