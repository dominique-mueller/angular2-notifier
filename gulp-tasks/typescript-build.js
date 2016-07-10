'use strict';

/**
 * Gulp imports
 */
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const merge = require( 'merge2' );
const sourcemaps = require( 'gulp-sourcemaps' );
const typescript = require( 'gulp-typescript' );

/**
 * Gulp task: Compile all TypeScript files into JavaScript (plus definition and sourcemap files)
 */
gulp.task( 'typescript:build', () => {

	// Create TypeScript project
	const typescriptProject = typescript.createProject( './tsconfig.json' );

	// Compile and generate files
	const typescriptResult = gulp
		.src( [ // Keep the folder structure alive
			'./**/*.ts',
			'./typings/index.d.ts',
			'!./demo/**/*',
			'!./node_modules/**/*',
			'!./typings/globals/*'
		] )
		.pipe( sourcemaps.init() )
		.pipe( typescript( typescriptProject ) );

	// Save results
	return merge( [
		typescriptResult.js // Save compiled JavaScript files (plus sourcemaps)
			.pipe( sourcemaps.write( './' ) )
			.pipe( gulp.dest( './' ) ),
		typescriptResult.dts // Save generated TypeScript definition files
			.pipe( gulp.dest( './' ) )
	] );

} );

/**
 * Gulp task: Compile each demo TypeScript file into a JavaScript file
 */
gulp.task( 'typescript:build--demo', () => {

	// Create TypeScript project
	const typescriptProject = typescript.createProject( './tsconfig.json' );

	// Compile and generate files
	const typescriptResult = gulp
		.src( [
			'./demo/*.ts',
			'./typings/index.d.ts'
		] )
		.pipe( typescript( typescriptProject ) );

	return typescriptResult.js // Save compiled JavaScript files (plus sourcemaps)
		.pipe( gulp.dest( './demo' ) );

} );
