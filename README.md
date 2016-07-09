[![GitHub tag](https://img.shields.io/github/tag/dominique-mueller/angular2-notifier.svg?maxAge=2592000)](https://github.com/dominique-mueller/angular2-notifier/releases)
[![npm version](https://img.shields.io/npm/v/angular2-notifier.svg?maxAge=2592000)](https://www.npmjs.com/package/angular2-notifier)
[![license](https://img.shields.io/npm/l/angular2-notifier.svg?maxAge=2592000)](https://github.com/dominique-mueller/angular2-notifier/LICENSE)
[![dependency status](https://img.shields.io/david/dominique-mueller/angular2-notifier.svg?maxAge=2592000)](https://david-dm.org/dominique-mueller/angular2-notifier)
[![dev dependency status](https://img.shields.io/david/dev/dominique-mueller/angular2-notifier.svg?maxAge=2592000)](https://david-dm.org/dominique-mueller/angular2-notifier#info=devDependencies)
[![travis ci build status](https://img.shields.io/travis/dominique-mueller/angular2-notifier/master.svg?maxAge=2592000)](https://travis-ci.org/dominique-mueller/angular2-notifier)

# angular2-notifier

A well designed, fully animated, highly customizable and easy to use notification library for your Angular 2 application.

> Please note that this library is still in an early stage, it will hit version 1.0 as soon as Angular 2 reaches its final version. Therefore, as long as Angular 2 is in RC, new releases before 1.0 might introduce breaking changes. They will be documented in the [changelog](/CHANGELOG.md).

<br>

## Demo

You can play around with this library on the **[Plunkr project right here](http://plnkr.co/edit/Z8yu8I)**.

![Preview](/docs/preview.gif?raw=true)

<br>

## Content

- **[How to install](#how-to-install)**<br>Download via npm, setup in SystemJS

- **[How to setup](#how-to-setup)**<br>Setup in Angular 2 application, include styles

- **[How to use](#how-to-use)**<br>Show notifications, clear notifications

- **[How to configure](#how-to-configure)**<br>Customize how notifications look, behave and animate

> Moreover, you can take a look at the **[Changelog](/CHANGELOG.md)** as well as at the **[MIT License](/LICENSE)**.

<br><br>

## How to install

Download this library via **npm**:

``` shell
npm install angular2-notifier --save
```

Configure the library for **SystemJS** by extending your configuration with:

``` javascript
var map = {
	'angular2-notifier': 'node_modules/angular2-notifier'
};

var packages = {
	'angular2-notifier': {
		defaultExtension: 'js',
		main: 'index.js'
	}
};
```

<br><br>

## How to setup

You need to setup the library in your Angular 2 application as well as include the styles for it.

<br>

### Setup library in your Angular 2 application

You need to tell the Angular 2 Dependency Injection about our library. To do so, provide the highest component of your application (root component) with the `Notifier Service`.

``` typescript
import { NotifierService } from 'angular2-notifier';

@Component( {
	providers: [
		NotifierService
	]
} )
export class AppComponent {
	// Implementation details
}
```

Or, **alternatively**, provide the `Notifier Service` within your bootstrap process:

````typescript
import { NotifierService } from 'angular2-notifier';

bootstrap( AppComponent, [
	NotifierService
] );
```

<br>

### Setup styles

All styles are modular. You can choose between the original SASS files, or the compiled CSS files - depending on what technology you are using.

> Tip: Use the simple way for development, but the advanced way for production. Optimally you would include the styles in your frontend build process.

#### The simple way

You can use all existing styles by just including one file. You can include the `style.css` file in your HTML:

``` html
<!-- Include all styles at once -->
<link rel="stylesheet" href="[..]/node_modules/angular2-notifier/styles/style.css">
```

Or, **alternatively**, import the `style.scss` file into you own SASS styles:

``` sass
// Don't forget the file extension
@import "[..]/node_modules/angular2-notifier/styles/style.scss"; // Don't forget the file extension
```

#### The advanced way

It's much better (and in the end more performant) to just include the styles you actually need in your application. Therefore, all styles of this library are modular:

- You always need the `core` file
- Import the themes you need from the `themes` folder (or create your own one and import none of them)
- Import the types you need from the `types` folder (or create you own ones and import none of them)

For example, if you want to use the `material` theme, and only need `success` and `error` notifications, you can include only the necessary files into your HTML:

``` html
<!-- Include all styles at once -->
<link rel="stylesheet" href="[..]/node_modules/angular2-notifier/styles/core.css">
<link rel="stylesheet" href="[..]/node_modules/angular2-notifier/styles/themes/theme-material.css">
<link rel="stylesheet" href="[..]/node_modules/angular2-notifier/styles/types/type-success.css">
<link rel="stylesheet" href="[..]/node_modules/angular2-notifier/styles/types/type-error.css">
```

Or, **alternatively** and even better, import them into you own SASS styles:

``` sass
// Don't forget the file extension
@import "[..]/node_modules/angular2-notifier/styles/core.scss";
@import "[..]/node_modules/angular2-notifier/styles/themes/theme-material.scss";
@import "[..]/node_modules/angular2-notifier/styles/types/type-success.scss";
@import "[..]/node_modules/angular2-notifier/styles/types/type-error.scss";
```

<br><br>

## How to use

It's as simple as it can get. **Before you can actually play around with notifications**, you need to import and setup the `Notifier Service` within every component you want to use them.

``` typescript
import { NotifierService } from 'angular2-notifier';

@Component( {
	// Implementation details ...
} )
export class MyComponent {

	private notifier: NotifierService;

	public constructor( notifier: NotifierService ) {
		this.notifier = notifierService;
	}

}
```

<br>

### Show notifications

Showing a notification is easy; all you need is a type and a message.

``` typescript
// Show notification, with type and message
this.notifier.show( 'info', 'This is a fancy info notification!' );

// Also, a Promise gets resolved when the notification is visible
this.notifier.show( 'info', 'This is a fancy info notification!' ).then( () => {
	console.log( 'Yep, the notification is not visible.' );
} );
```

And because we're all lazy, there also shortcuts you can use for the following types of notifications:

``` typescript
// Shortcuts (also with Promises available)
this.notifier.default( 'This is a fancy default notification!' );
this.notifier.info( 'This is a fancy info notification!' );
this.notifier.success( 'This is a fancy success notification!' );
this.notifier.warning( 'This is a fancy warning notification!' );
this.notifier.error( 'This is a fancy error notification!' );
```

<br>

### Clear notifications

You can clear all visible notification at once.

``` typescript
// Clear ... every ... single ... notification
this.notifier.clearAll();

// And again, a Promise tells you when all notifications are cleared
this.notifier.clearAll().then( () => {
	console.log( 'They're gone. All of them.' );
} );
```

Or, just clear the oldest notification.

``` typescript
// Clear the oldest notification only
this.notifier.clearOldest();

// Again ... this Promise thing ...
this.notifier.clearOldest().then( () => {
	console.log( 'So, the oldest one is kicked out.' );
} );
```

And of course, you can also clear just the newest notification.

``` typescript
// Clear the newest notification only
this.notifier.clearNewest();

// Sing it with me ... Promise!
this.notifier.clearNewest().then( () => {
	console.log( 'Well well, the newest one is finally gone.' );
} );
```

<br><br>

## How to configure

This library is fully customizable, so it works the way you want it to and it blends perfectly into the rest of your application. The default configuration already tries to provide the best experience.

> Note: This step is additional to the setup step, so you still need to provide the `Notifier Service`.

If you want to configure the library, you can tell the Angular 2 Dependency Injection (and this way also this library) about your own options. To do so, provide the highest component of your application (root component) with your custom configuration.

``` typescript
import { NotifierGlobalOptions, provideNotifierOptions } from 'angular2-notifier';

const myNotifierConfiguration: NotifierGlobalOptions = {
	// You custom options in here
};

@Component( {
	providers: [
		provideNotifierOptions( myNotifierConfiguration )
	]
} )
export class AppComponent {
	// Implementation details
}
```

Or, **alternatively**, provide your custom configuration within your bootstrap process:

````typescript
import { NotifierGlobalOptions, provideNotifierOptions } from 'angular2-notifier';

const myNotifierConfiguration: NotifierGlobalOptions = {
	// You custom options in here
};

bootstrap( AppComponent, [
	provideNotifierOptions( myNotifierConfiguration )
] );
```

<br>

### Position

With the `position` property you can define, where exactly notifications will appear on the screen.

``` typescript
position: {

	horizontal: {

		/**
		 * Defines the horizontal position on the screen
		 * @type {String} - select between 'left' | 'middle' | 'right'
		 */
		position: 'left', // 'left' by default

		/**
		 * Defines the horizontal distance to the screen edge
		 * @type {Number} - interpreted in px
		 */
		distance: 12 // 12 by default

	},

	vertical: {

		/**
		 * Defines the vertical position on the screen
		 * @type {String} - select between 'top' | 'bottom'
		 */
		position: 'bottom', // 'bottom' by default

		/**
		 * Defines the vertical distance to the screen edge
		 * @type {Number} - interpreted in px
		 */
		distance: 12 // 12 by default


	},

	/**
	 * Defines the gap (horizontal distance) between multiple notifications
	 * @type {Number} - interpreted in px
	 */
	gap: 10 // 10 by default

}
```

<br>

### Theme

With the `theme` property you can define the look and feel of the notification.

``` typescript
/**
 * Defines the notification design theme
 * @type {String} - select 'material' or your own custom one
 */
theme: 'material' // 'material' by default
```

The value of the property `theme` will be part of a class which is being added to the notifications. For example, using the theme `material` means that each notification gets the additional class `x-notifier__notification--material`.

> You can use this mechanism to create you own theme in CSS and apply it via the `theme` option. Take a look at the `material` theme for an example on how to create your own custom theme.

<br>

### Behaviour

With the `behaviour` property you can define how notifications will behave in different situations.

``` typescript
behaviour: {

	/**
	 * Defines whether the notificaiton will hide itself automatically after a timeout.
	 * @type {Number|Boolean} - 'false' to disable, number to enable in ms.
	 */
	autoHide: 5000, // set to 5000 by default

	/**
	 * Defines whether the 'autoHide' timeout will be paused when hovering over the notification area.
	 * Note: 'autoHide' must be enabled, and do not use together with 'resetOnMouseover'
	 * @type {Boolean} - 'true' to enable, 'false' to disable.
	 */
	pauseOnMouseover: true, // enabled by default

	/**
	 * Defines whether the 'autoHide' timeout will be reset when hovering over the notification area.
	 * Note: 'autoHide' must be enabled, and do not use together with 'pauseOnMouseover'
	 * @type {Boolean} - 'true' to enable, 'false' to disable.
	 */
	resetOnMouseover: false, // disabled by default

	/**
	 * Defines whether the notification will be dismissed when clicking on it.
	 * @type {Boolean} - 'true' to enable, 'false' to disable.
	 */
	dismissOnClick: false, // disable by default

	/**
	 * Defines whether multiple notification are being stacked, and what the stacking limit is.
	 * @type {Number|Boolean} - 'false' to disable, number as maximum stacking limit.
	 */
	stacking: 4, // set to 4 by default

	/**
	 * Defines whether the dismiss button is visible.
	 * @type {Boolean} - 'true' to show it, 'false' to hide it.
	 */
	showDismissButton: true // visible by default

}
```

> IMPORTANT: The `showDismissButton` option will probably change in future releases.

<br>

### Animations

With the `animations` property you can define how notifications will be animated.

``` typescript
animations: {

	/**
	 * Defines whether all (!) animations are switched on / off.
	 * @type {Boolean} - 'true' to enable, 'false' to disable.
	 */
	enabled: true, // 'true' by default

	show: {

		/**
		 * Defines the type of animation that will be used to animate a notification in.
		 * @type {String} - select between 'fade' | 'slide'.
		 */
		method: 'slide', // 'slide' by default

		/**
		 * Defines how long it should take to animate a notification in.
		 * @type {Number} - interpretad in ms
		 */
		duration: 300, // 300 by default

		/**
		 * Defines what easing method will be applied when animating a notification in.
		 * @type {String} - select standard CSS easing method, e.g. 'ease-in-out' or 'linear' ...
		 */
		easing: 'ease' // 'ease' by default

	},

	hide: {

		/**
		 * Defines the type of animation that will be used to animate a notification out.
		 * @type {String} - select between 'fade' | 'slide'.
		 */
		method: 'fade', // 'fade' by default

		/**
		 * Defines how long it should take to animate a notification out.
		 * @type {Number} - interpretad in ms
		 */
		duration: 300, // 300 by default

		/**
		 * Defines what easing method will be applied when animating a notification out.
		 * @type {String} - select standard CSS easing method, e.g. 'ease-in-out' or 'linear' ...
		 */
		easing: 'ease' // 'ease' by default

	},

	shift: {

		/**
		 * Defines how long it should take to shift notifications around.
		 * @type {Number} - interpretad in ms
		 */
		duration: 300,

		/**
		 * Defines what easing method will be applied when shifting notifications around.
		 * @type {String} - select standard CSS easing method, e.g. 'ease-in-out' or 'linear' ...
		 */
		easing: 'ease'

	},

	clear: {

		/**
		 * Defines the animation offset, used when clearing out all notifications.
		 * @type {Number} - '0' to disable, number to enable in ms.
		 */
		offset: 50

	}

}
```

<br>

## In short: The default configuration

So, to sum it up, these are the default options:

``` typescript
const notifierDefaultOptions: NotifierGlobalOptions = {
	position: {
		horizontal: {
			distance: 12,
			position: 'left'
		},
		vertical: {
			position: 'bottom',
			distance: 12
		},
		gap: 10
	},
	theme: 'material',
	behaviour: {
		autoHide: 5000,
		dismissOnClick: false,
		pauseOnMouseover: true,
		resetOnMouseover: false,
		stacking: 4,
		showDismissButton: true
	},
	animations: {
		enabled: true,
		show: {
			method: 'slide',
			duration: 300,
			easing: 'ease'
		},
		hide: {
			method: 'fade',
			duration: 300,
			easing: 'ease'
		},
		shift: {
			duration: 300,
			easing: 'ease'
		},
		clear: {
			offset: 50
		}
	}
};
```
