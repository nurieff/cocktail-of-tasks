var gulpif = require('gulp-if')
    , sourcemaps = require('gulp-sourcemaps')
    , concat = require("gulp-concat")
    , cssnano = require("gulp-cssnano")
    , node_path = require('path')
;

/**
 * @constructor
 */
function Task_Styles(Task) {
    CocktailOfTasks.TaskFabric.apply(this, arguments);

    this._default_config = 'styles';
    this._defaultDirFrom = 'css';
    this._defaultDirTo = 'css';
}

/**
 * @this {Task_Fabric|Task_Styles}
 * @type {Task_Fabric|Task_Styles}
 */
Task_Styles.prototype = Object.create(CocktailOfTasks.TaskFabric.prototype);
Task_Styles.prototype.constructor = Task_Styles;

/**
 * @this {Task_Fabric|Task_Styles}
 * @type {Task_Fabric|Task_Styles}
 */
Task_Styles.prototype.run = function(config) {
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

    if (CocktailOfTasks.isProduction && !full) {
        list.push('Compress');
    }

    var _src = src;
    var _dest = copy_to + concat_name;

    return CocktailOfTasks.gulp.src(src)
        .pipe(CocktailOfTasks.plumber(this.reportError.bind(this,_src, _dest)))
        .pipe(gulpif(sourceMap, sourcemaps.init()))
        .pipe(concat(concat_name))
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
        .pipe(CocktailOfTasks.gulp.dest(copy_to))
        .pipe(CocktailOfTasks.notify(this.report.bind(this, _src, _dest, true, list)))
        ;
};

module.exports = function(Task) {
    return new Task_Styles(Task);
};