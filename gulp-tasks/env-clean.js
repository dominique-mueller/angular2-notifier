'use strict';

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const del = require( 'del' );

/**
 * Gulp: Clean the project build
 */
gulp.task( 'env:clean:project', () => {
	return del( [
		'./index.js',
		'./src/*.js'
	] );
} );

/**
 * Gulp: Clean the demo build
 */
gulp.task( 'env:clean:demo', () => {
	return del( [
		'./demo/main.js',
		'./demo/app.component.js'
	] );
} );
