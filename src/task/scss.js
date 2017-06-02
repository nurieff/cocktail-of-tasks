var gulpif = require('gulp-if')
    , merge = require('merge-stream')
    , rename = require('gulp-rename')
    , spritus = require('gulp-css-spritus')
    , assetus = require('gulp-css-assetus')
    , cssnano = require("gulp-cssnano")
    , gcmq = require("gulp-group-css-media-queries")
    , node_path = require('path')
    , sass = require('gulp-sass')
    , sourcemaps = require('gulp-sourcemaps')

    , imageminPngquant = require('imagemin-pngquant')
    , imageminMozjpeg = require('imagemin-mozjpeg')

;

/**
 * @param Task
 * @constructor
 */
function Task_SCSS(Task) {
    CocktailOfTasks.TaskFabric.apply(this, arguments);

    this._default_config = 'scss';
    this._defaultDirFrom = 'scss';
    this._defaultDirTo = 'css';
}

/**
 * @this {CocktailOfTasks.TaskFabric|Task_SCSS}
 * @type {CocktailOfTasks.TaskFabric|Task_SCSS}
 */
Task_SCSS.prototype = Object.create(CocktailOfTasks.TaskFabric.prototype);
Task_SCSS.prototype.constructor = Task_SCSS;

Task_SCSS.prototype.getDefaultConfig = function() {
    return {
        from: "scss/main.scss",
        to: "css/"
    }
};


/**
 * @this {Task_Fabric|Task_SCSS}
 * @type {Task_Fabric|Task_SCSS}
 */
Task_SCSS.prototype.run = function(config, callback) {
    var full = ('full' in config ? config['full'] : false);
    var path_to = this._path.get('to', config, this._defaultDirTo, true);
    var path_from = this._path.get('from', config, this._defaultDirFrom);
    var includePaths = 'includePaths' in config ? config['includePaths'] : [];

    var imageDirCSS = 'image_dir_css' in config ? config['image_dir_css'] : '../images/';
    var imageDirSave = this._path.public(('image_dir_save' in config ? config['image_dir_save'] : 'images/'))

    var sourceMap = ('source_map' in config ? config['source_map'] : false);
    var sourceMapType = ('source_map_type' in config ? config['source_map_type'] : 'inline');
    sourceMapType = sourceMapType === 'inline' ? 'inline-source-map' : 'source-map';

    //gulpif
    if (CocktailOfTasks.isProduction) {
        sourceMap = false;
    }

    var filename_from = node_path.basename(path_from);
    path_from = node_path.dirname(path_from) + '/';

    var filename_to = filename_from;
    if (node_path.extname(path_to) != '') {
        filename_to = node_path.basename(path_to);
        path_to = node_path.dirname(path_to) + '/';
    } else {
        filename_to = node_path.basename(filename_to, '.scss') + '.css';
    }

    var list = [];

    if (sourceMap) {
        if (sourceMapType === 'source-map') {
            list.push('Source map: file');
        } else {
            list.push('Source map: inline');
        }
    }

    if (CocktailOfTasks.isProduction && !full) {
        list.push('Compress');
    }

    includePaths = includePaths.map(function(name) {
        return CocktailOfTasks.path.init(name);
    });

    var _src = path_from + filename_from;
    var _dest = path_to + filename_to;

    return CocktailOfTasks.gulp.src(_src)
        .pipe(CocktailOfTasks.plumber(this.reportError.bind(this,_src, _dest)))
        .pipe(gulpif(sourceMap, sourcemaps.init()))
        .pipe(sass({
            //outputStyle: (CocktailOfTasks.isProduction && !full ? 'compressed' : 'expanded'),
            outputStyle: 'expanded',
            includePaths: includePaths
        }).on('error', sass.logError))
        .pipe(spritus({
            imageDirCSS: imageDirCSS,
            imageDirSave: imageDirSave,
            withImageminPlugins: [
                imageminMozjpeg({
                    jpeg: {
                        quality: 60,
                        //targa: true
                    }
                }),
                imageminPngquant({
                    quality: '60-70',
                    speed: 1
                })
            ]
        }))
        .pipe(assetus({
            imageDirCSS: imageDirCSS,
            imageDirSave: imageDirSave,
            withImageminPlugins: [
                imageminMozjpeg({
                    jpeg: {
                        quality: 60,
                        //targa: true
                    }
                }),
                imageminPngquant({
                    quality: '60-70',
                    speed: 1
                })
            ]
        }))
        .pipe(gcmq())
        .pipe(gulpif(
            !full && CocktailOfTasks.isProduction,
            cssnano({
                autoprefixer: {
                    browsers: ['last 10 versions'],
                    add: true
                }
            })
        ))
        .pipe(gulpif(sourceMap, sourcemaps.write(
            (sourceMapType === 'inline-source-map' ? null : '.'),
            {includeContent: (sourceMapType === 'inline-source-map')}
        )))
        .pipe(rename(filename_to))
        .pipe(CocktailOfTasks.gulp.dest(path_to))
        .pipe(CocktailOfTasks.notify(this.report.bind(this, _src, _dest, true, list)))
        ;

};

module.exports = function(Task) {
    return new Task_SCSS(Task);
};