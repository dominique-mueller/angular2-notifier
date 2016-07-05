'use strict';

/**
 * Gulp imports
 */
const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );

/**
 * Gulp tasks imports
 */
const envClean = require( './gulp-tasks/env-clean' );
const sassBuild = require( './gulp-tasks/sass-build' );
const sassLint = require( './gulp-tasks/sass-lint' );
const typescriptBuild = require( './gulp-tasks/typescript-build' );
const typescriptLint = require( './gulp-tasks/typescript-lint' );

/**
 * Gulp task: Build library (for development)
 */
gulp.task( 'build:dev',
	gulp.series( [
		'env:clean',
		gulp.parallel( [
			'typescript:build',
			'sass:build'
		] )
	] )
);

/**
 * Gulp task: Build library (for production)
 */
gulp.task( 'build:prod',
	gulp.series( [
		'env:clean',
		gulp.parallel( [
			'typescript:lint',
			'sass:lint'
		] ),
		gulp.parallel( [
			'typescript:build',
			'sass:build'
		] )
	] )
);

/**
 * Gulp task: Build demo
 */
gulp.task( 'build:demo',
	gulp.series( [
		'env:clean--demo',
		'typescript:build--demo'
	] )
);

/**
 * Gulp task: Watcher using browser-sync
 */
gulp.task( 'watch',
	gulp.series( [
		gulp.parallel( [ 'build:dev', 'build:demo' ] ),
		() => {

			// Setup browser-sync
			browserSync.init( {
				server: {
					baseDir: './' // Because we need access to the node_modules folder,
				},
				logPrefix: 'BrowserSync',
				logConnections: true,
				notify: {
					styles: { // Custom styles for the notification in the browser, bottom center
						top: 'auto',
						bottom: '0',
						right: 'auto',
						left: '50%',
						transform: 'translateX(-50%)',
						borderRadius: '0'
					}
				}
			} );

			// Watch project files
			gulp.watch( [ './src/**/*.ts', './index.ts' ], gulp.series( 'typescript:build' ) );
			gulp.watch( [ './styles/**/*.scss' ], gulp.series( 'sass:build' ) );

			// Watch demo files
			gulp.watch( [ './demo/*.ts' ], gulp.series( [ 'typescript:build--demo' ] ) );

		}
	] )
);