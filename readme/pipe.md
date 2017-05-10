For extend gulp.pipe you can use
```javascript
.pipe(CocktailOfTasks.pipe(function(file, enc, cb) {
	console.log(file.path);
	console.log(file.contents.toString());
	cb(null, file);
}))
```