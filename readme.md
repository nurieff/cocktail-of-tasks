# Important
Please use the [gulp-query](https://www.npmjs.com/package/gulp-query) is more easy and more flexible.
The **gulp-query** uses plugins and you can customize your cocktail

[Try gulp-query](https://www.npmjs.com/package/gulp-query)

## Cocktail Of Tasks — *Deprecated* 

Cocktail light and powerful task for gulp 

```
npm install cocktail-of-tasks
```

```
gulp
gulp --production // For compress files if option "full" is false
gulp watch
gulp scss
gulp scss webpack copy
gulp webpack watch
gulp scss_{config_name}
gulp scss_{config_name} watch
```

### Example
Paste the code into your `gulpfile.js` and configure it
```javascript
var cocktail = require('cocktail-of-tasks');
cocktail(function (mix) {
	 mix
		 .scripts()
		 .styles()
		 .copy()
		 .compress()
		 .scss()
		 .webpack()
		 .sprite();
});
```

## Options

For default, source folder is `resources/assets/` and result folder is `public/`

If you want to change, use
```javascript
CocktailOfTasks.dir.assets = 'src/';
CocktailOfTasks.dir.public = 'dist/';
```

## .scripts()
Can merge multiple files into one. Compresses the resulting file.
You can add source map.
Translate es6 to es5 (Uses [buble](https://www.npmjs.com/package/buble))

```javascript
mix.scripts({
	//name: "new_name", // If you want to use "gulp scripts_{name}"
	to: "js/scripts.js",
	source_map: true, 
	source_map_type: 'inline',
	full: false, // If true — no compress
	babel: true, // ES2015 to ES5
	//from: "/node_modules", // Use for parent folder
	src: [
		"src/js/1.js",
		"src/js/2.js",
		//...,
	]
})
```

## .scss()

Uses [gulp-css-spritus](https://github.com/nurieff/gulp-css-spritus) and 
[gulp-css-assetus](https://github.com/nurieff/gulp-css-assetus)

```javascript
mix.scss({
	//name: "new_name",
	from: "scss/app.scss",
	to: "css/",
	source_map: true,
	source_map_type: 'inline',
	full: false,
	image_dir_css: '../images/', // for css (image-url)
	image_dir_save: 'images/', // for save image assets
	includePaths: [
		//'../node_modules/compass-mixins/lib/',
	]
})
```

## .styles()

Can merge multiple files into one. Compresses the resulting file.
You can add source map.

```javascript
mix.styles({
	//name: "new_name",
	to: "css/styles.css",
	source_map: true,
	source_map_type: 'inline',
	full: false,
	//from: "/node_modules",
	src: [
		"src/css/1.css",
		"src/css/2.css",
		//...,
	]
})
```

## .webpack()

Uses [buble](https://www.npmjs.com/package/buble)

```javascript
mix.webpack({
	//name: "new_name",
	from: "js/webpack.js",
	to: "js/",
	full: false,
	babel: true,
	source_map: true
})
```

## .copy()

Easy copy. Can merge multiple files into one

```javascript
mix.copy([
	{
		//name: "new_name", // If you want to use "gulp copy_{name}"
		src: "src/css/need_copy.css",
		to: "css/new_name.css"
	},
	{
		src: [
			"src/css/need_copy1.css",
			"src/css/need_copy2.css"
		],
		to: "css/"
	},
	{
		name: "new_copy_name",
		src: [
			"src/css/need_copy1.css",
			"src/css/need_copy2.css"
		],
		to: "css/",
		is_concat: true
	},
	{
		src: [
			"src/css/need_copy1.css",
			"src/css/need_copy2.css"
		],
		to: "css/new_copy_name.css"
	}
])
```

## .sprite()
A very useful thing for sprites.

You can get image with json and other variants 

[About «format»](https://github.com/twolfson/spritesheet-templates#templates)
```javascript
mix.sprite({
	//name: "new_name",
	png: {
		quality: '60-70',
		speed: 1
	},
	jpeg: {
		quality: 60
	},
	to: {
		images: "images/",
		css: "json/"
	},
	css: {
		extension: "json",
		format: "json_texture"
	},
	sprites: {
		"auth_test": "images/auth/*.png",
		"watch": "images/watch/*.jpg",
	}
})
```

## .compress()

Compress images

```javascript
mix.sprite({
	//name: "new_name",
	png: {
		quality: '60-70',
		speed: 1
	},
	jpeg: {
		quality: 60
	},
	to: "images/",
	//from: "images/",
	images: [
		{ from: "dir/*.png", to:"dir/" },
		"dir2/*.jpg"
	]
})
```
***