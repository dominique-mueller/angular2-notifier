'use strict';

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const browserSync = require( 'browser-sync' );

/**
 * Task imports
 */
const typescriptBuild = require( './gulp-tasks/typescript-build' );
const envClean = require( './gulp-tasks/env-clean' );
const sassBuild = require( './gulp-tasks/sass-build' );

/**
 * Gulp task: Build project
 */
gulp.task( 'build:simple',
	gulp.series( [
		'env:clean--single',
		'typescript:build--single',
		'sass:build--single'
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
		gulp.parallel( [ 'build:simple', 'build:demo' ] ),
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
			gulp.watch( [ './src/**/*.ts', './index.ts' ], gulp.series( 'typescript:build--single' ) );
			gulp.watch( [ './styles/**/*.scss' ], gulp.series( 'sass:build--single' ) );

			// Watch demo files
			gulp.watch( [ './demo/*.ts' ], gulp.series( [ 'typescript:build--demo' ] ) );

		}
	] )
);
