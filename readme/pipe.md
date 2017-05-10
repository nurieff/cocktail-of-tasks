Для расширение gulp.pipe можно использовать

	.pipe(CocktailOfTasks.pipe(function(file, enc, cb) {
		console.log(file.path);
		console.log(file.contents.toString());
		cb(null, file);
	}))