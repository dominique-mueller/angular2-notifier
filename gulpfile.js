'use strict';

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const browserSync = require( 'browser-sync' );

/**
 * Task imports
 */
const typescriptBuild = require( './gulp-tasks/typescript.build.js' );

/**
 * Gulp task: Watcher using browser-sync
 */
gulp.task( 'watch',
	gulp.series( [
		gulp.parallel( [ 'typescript:build', 'typescript:build:demo' ] ),
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
			gulp.watch( [ './src/*.ts', './index.ts' ], gulp.series( [ 'typescript:build' ] ) );

			// Watch demo files
			gulp.watch( './demo/*.ts', gulp.series( [ 'typescript:build:demo' ] ) );
			gulp.watch( [ './demo/*.html', './demo/systemjs.config.js' ] ).on( 'change', browserSync.stream ); // TODO: This isn't working at all :/

		}
	] )
);
