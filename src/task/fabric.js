var fs = require("fs"),
    merge = require('merge-stream');

function StreamCallback(callback, all) {
    this._all = all;
    this._current = 0;
    this._callback = callback;
}

StreamCallback.prototype.finish = function() {
    ++this._current;

    if (this._current >= this._all) {
        this._callback.call();
    }
};

/**
 *
 * @param {CocktailOfTasks} Task
 * @constructor
 */
function Task_Fabric(Task) {
    /**
     * @type {CocktailOfTasks}
     * @private
     */
    this._Task = Task;
    this._dir = CocktailOfTasks.dir;
    this._path = CocktailOfTasks.path;
    this._default_config = 'fabric';
    this._defaultDirFrom = null;
    this._defaultDirTo = null;
    this._isConcatConfig = false;
}

var p = Task_Fabric.prototype;

p.init = function(config_name, callback) {
    var config;
    if (typeof config_name === 'string') {
        config_name = config_name || this._default_config;
        config = CocktailOfTasks.configGet(config_name);

        if (config == null) {
            config = this.getDefaultConfig();
        }

    } else {
        config = config_name;
    }

    var _p;

    try {
        if (config instanceof Array) {

            var SC = new StreamCallback(callback, config.length);

            var streams = [];

            for (var ci = 0, cl = config.length; ci < cl; ++ci) {
                _p = this.run(config[ci], SC.finish.bind(SC));
                if (_p) {
                    if (Array.isArray(_p)) {
                        _p.forEach(function(_s) {
                            streams.push(_s);
                        })
                    } else {
                        streams.push(_p);
                    }

                }

            }

            if (streams.length < 1) return null;

            return merge.apply(null, streams);
        } else {
            _p = this.run(config, callback);

            if (Array.isArray(_p)) {
                return merge.apply(null, _p);
            } else {
                return _p;
            }
        }
    } catch (e) {
        console.error('ERROR');
        console.error(config);
        console.error(e);
    }

};
/**
 * Возвращает дефолтное название конфига
 * @returns {string}
 */
p.getDefaultConfigName = function() {
    return this._default_config;
};

p.getDefaultDirFrom = function() {
    return this._defaultDirFrom;
};

p.getDefaultDirTo = function() {
    return this._defaultDirTo;
};

p.isConcatConfig = function() {
    return this._isConcatConfig;
};

p.makeConcatConfig = function(config) {

    var cfg = this.getDefaultConfig();

    for (var key in cfg) {
        if (!cfg.hasOwnProperty(key)) continue;

        if (!(key in config)) continue;

        cfg[key] = config[key];
    }

    return cfg;
};

/**
 * Возращает конфиг, если его нет
 * @returns {Object|Array|null}
 */
p.getDefaultConfig = function() {

    return null;
};

p.getFiles = function(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i = 0, l = files.length; i < l; ++i) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            this.getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }

    return files_;
};

p.report = function(src, dest, success, list) {
    CocktailOfTasks.report.add(this._default_config, src, dest, success, list);
};

p.reportAlias = function(alias, src, dest, success, list) {
    CocktailOfTasks.report.add(this._default_config + '-' + alias, src, dest, success, list);
};

p.run = function(config) {

};

module.exports = Task_Fabric;