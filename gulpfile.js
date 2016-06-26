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

/**
 * Gulp task: Build project
 */
gulp.task( 'build:project',
	gulp.series( [
		'env:clean:project',
		'typescript:build:project'
	] )
);

/**
 * Gulp task: Build demo
 */
gulp.task( 'build:demo',
	gulp.series( [
		'env:clean:demo',
		'typescript:build:demo'
	] )
);

/**
 * Gulp task: Watcher using browser-sync
 */
gulp.task( 'watch',
	gulp.series( [
		gulp.parallel( [ 'build:project', 'build:demo' ] ),
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
			gulp.watch( [ './src/*.ts', './index.ts' ], gulp.series( 'typescript:build:project' ) );

			// Watch demo files
			gulp.watch( [ './demo/*.ts' ], gulp.series( [ 'typescript:build:demo' ] ) );

		}
	] )
);
