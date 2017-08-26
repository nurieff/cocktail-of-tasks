var gulp = require('gulp');

var argv = require('yargs').argv
    , node_path = require('path')
    , _params = argv._.slice(0)
;

console.log('!!!');
console.log('The package is deprecated');
console.log('Please use the gulp-query is more easy and more flexible. https://www.npmjs.com/package/gulp-query');
console.log('!!!');

// console.log(argv);
//process.exit();

function CocktailOfTasks() {
    this._task = {};

    /**
     * @type {Task_Scripts}
     * @private
     */
    this._task.scripts = null;

    /**
     * @type {Task_Styles}
     * @private
     */
    this._task.styles = null;

    /**
     * @type {Task_Compress}
     * @private
     */
    this._task.compress = null;

    /**
     * @type {Task_Sprite}
     * @private
     */
    this._task.sprite = null;

    /**
     * @type {Task_SCSS}
     * @private
     */
    this._task.scss = null;

    /**
     * @type {Task_Webpack}
     * @private
     */
    this._task.webpack = null;


    /**
     * @type {Task_Copy}
     * @private
     */
    this._task.copy = null;

    this._init = {
        copy: [],
        scss: [],
        scripts: [],
        styles: [],
        compress: [],
        sprite: [],
        webpack: []
    };

    this._fileTypes = {
        scss: 'scss',
        scripts: 'js',
        styles: 'js',
        compress: '*',
        sprite: '*',
        copy: '*',
        webpack: 'js'
    };

    this._taskCfg = [];
    this._defaultTasks = [];
    this._initTaskNames = [];

    this._isWatch = false;
}

var p = CocktailOfTasks.prototype;
global.CocktailOfTasks = CocktailOfTasks;

/**
 * @type {{root: null, public: null, assets: null}}
 */
CocktailOfTasks.dir = {
    root: process.cwd() + '/',
    assets: 'resources/assets/',
    public: 'public/'
};

/**
 * @type {Path}
 */
CocktailOfTasks.path = require('./src/path')();

CocktailOfTasks.gulp = gulp;
CocktailOfTasks.plumber = require('gulp-plumber');
CocktailOfTasks.notify = require('gulp-notify');
CocktailOfTasks.report = require('./src/report')();

/**
 *
 * @type {boolean}
 */
CocktailOfTasks.isProduction = 'production' in argv;

/**
 * @type {Function}
 */
CocktailOfTasks.configGet = require('./src/config');

/**
 * @type {Task_Fabric}
 */
CocktailOfTasks.TaskFabric = require('./src/task/fabric');

/**
 * @type {Object.<string, {className: CocktailOfTasks.TaskFabric, fileType: String}>}
 * @private
 */
CocktailOfTasks._addTasks = {};

/**
 * @param {String} key
 * @param {CocktailOfTasks.TaskFabric} Task
 * @param {String} fileType
 */
CocktailOfTasks.addTask = function(key, Task, fileType) {
    CocktailOfTasks.prototype[key] = function() {
        this._prepare('key', arguments);
    };
    CocktailOfTasks._addTasks[key] = {
        className: Task,
        fileType: (fileType ? fileType : '')
    };
};

p._initModule = function(name) {
    if (!(name in this._task)) {
        this._task[name] = null;
    }
    if (!this._task[name]) {
        if (name in CocktailOfTasks._addTasks) {
            this._task[name] = CocktailOfTasks._addTasks[name].className.call(
                CocktailOfTasks._addTasks[name].className,
                this
            );
            this._fileTypes[name] = CocktailOfTasks._addTasks[name].fileType;
        } else {
            this._task[name] = require('./src/task/' + name)(this);
        }
    }
};

p.getModule = function(name) {
    this._initModule(name);
    return this._task[name];
};

p._prepare = function(type, args) {

    if (_params.length > 0 && (_params.length > 1 || _params.indexOf('watch') === -1)) {
        var find = false;
        for (var _i = 0, _l = _params.length; _i < _l; ++_i) {
            if (_params[_i] === 'watch') {
                continue;
            }

            if (_params[_i].indexOf(type) !== -1) {
                find = true;
                break;
            }


        }

        if (!find) return this;
    }

    args = Array.prototype.slice.call(args);

    if (!args[0]) {
        args = [type];
    } else if (Array.isArray(args[0])) {
        args = args[0];
    }

    var config;

    var cfg;
    for (var i = 0, l = args.length; i < l; ++i) {
        if (this._init[type].indexOf(args[i]) !== -1) continue;

        this._init[type].push(args[i]);

        config = CocktailOfTasks.configGet(args[i], type);

        if (!config || (Array.isArray(config) && config.length == 0)) {
            console.log(type + ': empty config');
            continue;
        }

        var config_name = args[i];

        if (Object.prototype.toString.call(config_name) === '[object Object]') {
            config_name = type;
        }

        var task_name = config_name.replace(".", '_');

        if (task_name in this._taskCfg) {
            if (Array.isArray(config)) {
                this._taskCfg[task_name].config = this._taskCfg[task_name].config.concat(config);
            } else {
                this._taskCfg[task_name].config.push(config);
            }
        } else {
            cfg = {
                type: type,
                task_name: task_name,
                config_name: config_name,
                config: Array.isArray(config) ? config : [config]
            };

            this._taskCfg[task_name] = cfg;
            this._defaultTasks.push(cfg.task_name);
        }

        if (Array.isArray(this._taskCfg[task_name].config)) {

            var _config = this._taskCfg[task_name].config;

            var _cfg, _name, _task_name;
            for (var conf_i = 0, conf_l = _config.length; conf_i < conf_l; ++conf_i) {

                _name = _config[conf_i].name ? _config[conf_i].name : conf_i;
                _task_name = type + '_' + _name;

                if (_task_name in this._taskCfg) continue;

                _cfg = {
                    type: type,
                    task_name: _task_name,
                    config_name: config_name + '.' + _name,
                    config: _config[conf_i]
                };

                this._taskCfg[_cfg.task_name] = _cfg;
            }
        }
    }

    return this;
};

p._initPath = function() {
    if (CocktailOfTasks.dir.assets.indexOf('/') !== 0) {
        CocktailOfTasks.dir.assets = CocktailOfTasks.dir.root + CocktailOfTasks.dir.assets;
    }

    if (CocktailOfTasks.dir.public.indexOf('/') !== 0) {
        CocktailOfTasks.dir.public = CocktailOfTasks.dir.root + CocktailOfTasks.dir.public;
    }
};

p.start = function() {

    if (CocktailOfTasks.isProduction) {
        console.log('>> IS PRODUCTION <<');
    }

    this._initPath();

    var params = argv._.slice(0);

    if (params.indexOf('watch') !== -1) {
        gulp.task('watch', this.watch.bind(this));
        this._isWatch = true;
    }

    var task_name;
    var taskCfg;

    var i, l;
    var _i, _l;

    var tasks = [];

    if (params.length === 0) {
        // default
        for (i = 0, l = this._defaultTasks.length; i < l; ++i) {
            tasks.push(this._defaultTasks[i]);
        }

        gulp.task('default', this._defaultTasks);
    } else if (params.indexOf('watch') !== -1) {
        var arr = [];
        if (params.length === 1) {
            arr = Object.keys(this._taskCfg);
        } else {
            var index = params.indexOf("watch");
            if (index >= 0) {
                params.splice(index, 1);
            }
            arr = params;
        }

        var _arr = Object.keys(this._taskCfg);

        for (i = 0, l = arr.length; i < l; ++i) {
            if (arr[i] in this._init) {
                for (_i = 0, _l = _arr.length; _i < _l; ++_i) {
                    if (_arr[_i].indexOf(arr[i]) !== -1) {
                        tasks.push(_arr[_i]);
                    }
                }
            } else {
                tasks.push(arr[i]);
            }
        }

    } else {
        for (i = 0, l = params.length; i < l; ++i) {
            tasks.push(params[i]);
        }
    }

    this._initTaskNames = tasks;

    for (i = 0, l = tasks.length; i < l; ++i) {
        task_name = tasks[i];

        if (!(task_name in this._taskCfg)) continue;

        taskCfg = this._taskCfg[task_name];
        this._initModule(taskCfg.type);

        if (!taskCfg.config) {
            taskCfg.config = this._task[taskCfg.type].getDefaultConfig();
        }

        gulp.task(task_name, this._task[taskCfg.type].init.bind(this._task[taskCfg.type], taskCfg.config));
    }

    if (!this._isWatch) {
        process.on('beforeExit', function() {
            CocktailOfTasks.report.draw();
        });
    }
};

p.scss = function() {
    return this._prepare('scss', arguments);
};

p.scripts = function() {
    return this._prepare('scripts', arguments);
};

p.styles = function() {
    return this._prepare('styles', arguments);
};

p.webpack = function() {
    return this._prepare('webpack', arguments);
};

p.compress = function() {
    return this._prepare('compress', arguments);
};

p.sprite = function() {
    return this._prepare('sprite', arguments);
};

p.postcss = function() {
    return this._prepare('postcss', arguments);
};

p.copy = function() {
    return this._prepare('copy', arguments);
};

p.watch = function() {

    var config;
    var fileType;
    var tasks = [];

    /**
     * @type {Task_Fabric} task
     */
    var task;

    for (var type in this._init) {
        if (!this._init.hasOwnProperty(type)) continue;

        if (this._init[type].length < 1) continue;

        this._initModule(type);

        fileType = this._fileTypes[type];

        task = this._task[type];

        //if (!fileType) continue;

        for (var ci = 0, cl = this._init[type].length; ci < cl; ++ci) {

            config = CocktailOfTasks.configGet(this._init[type][ci], type);

            if (!config) {
                config = task.getDefaultConfig();

                if (!config) continue;
            }

            if (task.isConcatConfig()) {
                config = task.makeConcatConfig(config);
            }

            var config_from;
            var task_name;

            var pathAll, pathOne, ext;

            if (Array.isArray(config)) {
                for (var conf_i = 0, conf_l = config.length; conf_i < conf_l; ++conf_i) {

                    task_name = (config[conf_i].name === type ? type : type + '_' + config[conf_i].name);

                    if (this._initTaskNames.indexOf(task_name) === -1) continue;

                    config_from = CocktailOfTasks.path.get('from', config[conf_i], task.getDefaultDirFrom());

                    ext = node_path.extname(config_from);

                    if (ext != '') {
                        pathAll = node_path.dirname(config_from) + '/' + node_path.basename(config_from, ext) + '/**/*' + ext;
                        pathOne = config_from;
                    } else {
                        pathAll = config_from + config[conf_i].name + '/**/*' + (fileType ? '.' + fileType : '');
                        pathOne = config_from + config[conf_i].name + (fileType ? '.' + fileType : '');
                    }

                    tasks.push({
                        task_name: task_name,
                        watch: [
                            pathAll,
                            pathOne
                        ]
                    });
                }
            } else {
                task_name = (!config.name || config.name === type ? type : type + '_' + config.name);

                if (this._initTaskNames.indexOf(task_name) !== -1) {
                    config_from = CocktailOfTasks.path.get('from', config, task.getDefaultDirFrom());

                    ext = node_path.extname(config_from);

                    if (ext != '') {
                        pathAll = node_path.dirname(config_from) + '/' + node_path.basename(config_from, ext) + '/**/*' + ext;
                        pathOne = config_from;
                    } else {
                        pathAll = config_from + (config.name && config.name !== type ? config.name + '/' : '') + '**/*' + (fileType ? '.' + fileType : '');
                        pathOne = config_from + (config.name && config.name !== type ? config.name : '*') + (fileType ? '.' + fileType : '');
                    }

                    tasks.push({
                        task_name: (!config.name || config.name === type ? type : type + '_' + config.name),
                        watch: [
                            pathAll,
                            pathOne
                        ]
                    });
                }

            }


        }
    }

    var i, il, k, kl;

    for (i = 0, il = tasks.length; i < il; ++i) {
        for (k = 0, kl = tasks[i].watch.length; k < kl; ++k) {
            gulp.watch(tasks[i].watch[k], [tasks[i].task_name]);
        }
    }

};

// module.exports = function () {
// 	return new Task();
// };

module.exports = function(callback) {
    if (typeof callback === "undefined") {
        return new CocktailOfTasks();
    }

    var t = new CocktailOfTasks();
    callback.call(null, t);
    t.start();
};