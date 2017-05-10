var rename = require('gulp-rename')
    , node_path = require('path')
    , gulpif = require('gulp-if')
    , concat = require("gulp-concat")
;

/**
 * @constructor
 */
function Task_Copy(Task) {
    CocktailOfTasks.TaskFabric.apply(this, arguments);

    this._default_config = 'copy';
    /**
     * @type {Object.<String,{src: Array, to: String, completeAmount: Number}>}
     * @private
     */
    this._reportsOfCopy = {};
}

/**
 * @this {CocktailOfTasks.TaskFabric|Task_Copy}
 * @type {CocktailOfTasks.TaskFabric|Task_Copy}
 */
Task_Copy.prototype = Object.create(CocktailOfTasks.TaskFabric.prototype);
Task_Copy.prototype.constructor = Task_Copy;

/**
 * @this {CocktailOfTasks.TaskFabric|Task_Copy}
 * @type {CocktailOfTasks.TaskFabric|Task_Copy}
 */
Task_Copy.prototype.getDefaultConfig = function() {
    return [
        {
            "name": "css",
            "to": "js/lib/test/",
            "src": [
                "resource/a.js",
                "resource/b.js",
            ]
        },
        {
            "name": "css",
            "to": "js/lib/test/",
            "src": "resource/a.js"
        },
        {
            "name": "css",
            "to": "js/lib/test/new_name.js",
            "src": "resource/old_name.js"
        },
        {
            "name": "css",
            "concat": true,
            "min": true,
            "to": "js/lib/test/",
            "src": [
                "resource/a.js",
                "resource/b.js",
            ]
        }
    ]
};

/**
 * @this {Task_Fabric|Task_Copy}
 * @type {Task_Fabric|Task_Copy}
 */
Task_Copy.prototype.run = function(config) {
    var src = config['src'];
    var name = 'name' in config ? config['name'] : null;

    var is_concat = 'concat' in config ? config['concat'] : false;
    var path_to = this._path.get('to', config, this._defaultDirTo, true);

    if (node_path.extname(path_to) != '') {
        is_concat = true;
    }

    var list = [];

    if (!Array.isArray(src)) {
        src = [src];
    }

    var prepareSrc = [];
    var self = this;
    src.forEach(function(f) {
        prepareSrc.push(self._path.init(f));
    });


    if (!is_concat) {

        this._reportsOfCopy[path_to] = {
            src: src,
            to: path_to,
            completeAmount: 0
        };

        return CocktailOfTasks.gulp.src(prepareSrc)
            .pipe(CocktailOfTasks.plumber({
                errorHandler: this.report.bind(this, src, path_to, false)
            }))
            .pipe(CocktailOfTasks.gulp.dest(path_to))
            //.pipe(CocktailOfTasks.notify(this.report.bind(this,src,path_to,true)))
            .pipe(CocktailOfTasks.notify(this.reportOfCopy.bind(this, path_to)))
            ;

    } else {

        if (src.length > 1) {
            list.push('Concat');
        } else {
            list.push('Rename');
        }


        var concat_name, copy_to;

        if (node_path.extname(path_to) == '') {
            concat_name = name + node_path.extname(src[0]);
            copy_to = path_to;
        } else {
            concat_name = node_path.basename(path_to);
            copy_to = node_path.dirname(path_to) + '/'
        }

        return CocktailOfTasks.gulp.src(prepareSrc)
            .pipe(CocktailOfTasks.plumber({
                errorHandler: this.report.bind(this, prepareSrc, copy_to + concat_name, false)
            }))
            .pipe(concat(concat_name))
            .pipe(CocktailOfTasks.gulp.dest(copy_to))
            .pipe(CocktailOfTasks.notify(this.report.bind(this, prepareSrc, copy_to + concat_name, true, list)))
            ;

    }
};

Task_Copy.prototype.reportOfCopy = function(pathTo) {
    if (!(pathTo in this._reportsOfCopy)) {
        return;
    }

    ++this._reportsOfCopy[pathTo].completeAmount;

    if (this._reportsOfCopy[pathTo].completeAmount >= this._reportsOfCopy[pathTo].src.length) {
        this.report(
            this._reportsOfCopy[pathTo].src,
            this._reportsOfCopy[pathTo].to,
            true
        );

        delete this._reportsOfCopy[pathTo];
    }
};

module.exports = function(Task) {
    return new Task_Copy(Task);
};