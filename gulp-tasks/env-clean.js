'use strict';

/**
 * Gulp imports
 */
const del = require( 'del' );
const gulp = require( 'gulp' );

/**
 * Gulp task: Clean project build, includes generated JavaScript and CSS files
 */
gulp.task( 'env:clean', () => {
	return del( [
		'./index.js',
		'./src/**/*.js',
		'./styles/**/*.css'
	] );
} );

/**
 * Gulp task: Clean demo build, includes generated JavaScript files
 */
gulp.task( 'env:clean--demo', () => {
	return del( [
		'./demo/main.js',
		'./demo/app.component.js'
	] );
} );
