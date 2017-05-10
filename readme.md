# Spirit Gulp Task

```
npm install spirit-gulp-task
```

```
gulp
gulp --production
gulp watch
gulp scss
gulp scss webpack
gulp scss watch
gulp scss_{config_name}
gulp scss_{config_name} watch
```

### Пример
```javascript
var task = require('spirit-gulp-task');
task(function (mix) {
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

## .scripts()
```javascript
mix.scripts({
	//name: "new_name",
	to: "js/scripts.js",
	source_map: true,
	source_map_type: 'inline',
	full: false,
	babel: true,
	//from: "/node_modules",
	src: [
		"src/js/1.js",
		"src/js/2.js",
		//...,
	]
})
```

## .scss()
```javascript
mix.scss({
	//name: "new_name",
	from: "scss/app.scss",
	to: "css/",
	source_map: true,
	source_map_type: 'inline',
	full: false,
	image_dir_css: '../images/', // for image assets
	image_dir_save: 'images/', // for image assets (default: /public/images/)
	includePaths: [
		//'../node_modules/compass-mixins/lib/',
	]
})
```

## .styles()
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
```javascript
mix.copy([
	{
		//name: "new_name",
		src: "src/css/need_copy.css",
		to: "css/new_name.css"
	},
	{
		src: [
			"src/css/need_copy1.css",
			"src/css/need_copy2.css",
		],
		to: "css/"
	},
	{
		name: "new_copy_name",
		src: [
			"src/css/need_copy1.css",
			"src/css/need_copy2.css",
		],
		to: "css/",
		is_concat: true
	},
	{
		src: [
			"src/css/need_copy1.css",
			"src/css/need_copy2.css",
		],
		to: "css/new_copy_name.css",
	}
])
```

## .sprite()
[Информация о format](https://github.com/twolfson/spritesheet-templates#templates)
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
* [Для расширения gulp.pipe(...)](readme/pipe.md)