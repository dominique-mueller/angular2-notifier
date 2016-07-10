'use strict';

/**
 * Gulp imports
 */
const del = require( 'del' );
const gulp = require( 'gulp' );

/**
 * Gulp task: Clean project build (generated JavaScript, TypeScript definition and CSS files)
 */
gulp.task( 'env:clean', () => {
	return del( [
		'index.js',
		'index.js.map',
		'index.d.ts',
		'./src/**/*.js',
		'./src/**/*.js.map',
		'./src/**/*.d.ts',
		'./styles/**/*.css'
	] );
} );

/**
 * Gulp task: Clean demo build (generated JavaScript files)
 */
gulp.task( 'env:clean--demo', () => {
	return del( [
		'./demo/main.js',
		'./demo/app.component.js'
	] );
} );
