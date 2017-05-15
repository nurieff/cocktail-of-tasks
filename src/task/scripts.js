var buble = require('gulp-buble')
    , gulpif = require('gulp-if')
    , uglify = require("gulp-uglify")
    , concat = require("gulp-concat")
    , node_path = require("path")
    , sourcemaps = require('gulp-sourcemaps')
;

/**
 * @constructor
 */
function Task_Scripts(Task) {
    CocktailOfTasks.TaskFabric.apply(this, arguments);

    this._default_config = 'scripts';
    this._defaultDirFrom = 'js';
    this._defaultDirTo = 'js';
}

/**
 * @this {CocktailOfTasks.TaskFabric|Task_Scripts}
 * @type {CocktailOfTasks.TaskFabric|Task_Scripts}
 */
Task_Scripts.prototype = Object.create(CocktailOfTasks.TaskFabric.prototype);
Task_Scripts.prototype.constructor = Task_Scripts;

/**
 * @this {Task_Fabric|Task_Scripts}
 * @type {Task_Fabric|Task_Scripts}
 */
Task_Scripts.prototype.run = function(config) {
    var full = ('full' in config ? config['full'] : false);

    var path_to = this._path.get('to', config, this._defaultDirTo, true);
    var path_from = config['form'] ? this._path.get('from', config, this._defaultDirFrom) : null;

    var src = [];
    for (var i = 0, l = config.src.length; i < l; ++i) {
        src.push(
            this._path.init(path_from ? (path_from + config.src[i]) : config.src[i])
        );
    }

    var concat_name, copy_to;

    if (node_path.extname(path_to) == '') {
        concat_name = config.name + node_path.extname(src[0]);
        copy_to = path_to;
    } else {
        concat_name = node_path.basename(path_to);
        copy_to = node_path.dirname(path_to) + '/'
    }

    var concat_file_path = copy_to + concat_name;

    var babelDo = ('babel' in config) ? config['babel'] : true;

    var sourceMap = ('source_map' in config ? config['source_map'] : false);
    var sourceMapType = ('source_map_type' in config ? config['source_map_type'] : 'inline');
    sourceMapType = sourceMapType === 'inline' ? 'inline-source-map' : 'source-map';

    //gulpif
    if (CocktailOfTasks.isProduction) {
        sourceMap = false;
    }

    var list = [];
    if (sourceMap) {
        if (sourceMapType === 'source-map') {
            list.push('Source map: file');
        } else {
            list.push('Source map: inline');
        }
    }

    if (src.length > 1) {
        list.push('Concat');
    }


    if (babelDo) {
        list.push('Babel');
    }

    if (CocktailOfTasks.isProduction && !full) {
        list.push('Compress');
    }

    return CocktailOfTasks.gulp.src(src)
        .pipe(CocktailOfTasks.plumber(this.reportError.bind(this,src,copy_to)))
        .pipe(gulpif(sourceMap, sourcemaps.init()))
        .pipe(gulpif(babelDo, buble()))
        .pipe(concat(concat_name))
        .pipe(gulpif(!full && CocktailOfTasks.isProduction, uglify()))
        .pipe(gulpif(sourceMap, sourcemaps.write(
            (sourceMapType === 'inline-source-map' ? null : '.'),
            {includeContent: (sourceMapType === 'inline-source-map')}
        )))
        .pipe(CocktailOfTasks.gulp.dest(copy_to))
        .pipe(CocktailOfTasks.notify(this.report.bind(this, src, copy_to, true, list)))
        ;
};

module.exports = function(Task) {
    return new Task_Scripts(Task);
};