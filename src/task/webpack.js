var webpack = require("webpack")
    , node_path = require('path')
;

var webpackConfig = {
    //debug: true,
    entry: null,
    output: {
        path: null,
        filename: null
    },
    module: {
        rules: []
    }
};

/**
 * @constructor
 */
function Task_Webpack(Task) {
    CocktailOfTasks.TaskFabric.apply(this, arguments);

    this._default_config = 'webpack';
    this._defaultDirFrom = 'js';
    this._defaultDirTo = 'js';
}

Task_Webpack._storage = {};

/**
 * @this {CocktailOfTasks.TaskFabric|Task_Webpack}
 * @type {CocktailOfTasks.TaskFabric|Task_Webpack}
 */
Task_Webpack.prototype = Object.create(CocktailOfTasks.TaskFabric.prototype);
Task_Webpack.prototype.constructor = Task_Webpack;

Task_Webpack.prototype.getDefaultConfig = function() {
    return [
        {
            name: "webpack",
            from: "js/app.js",
            full: true,
            to: "js/"
        }
    ]
};

/**
 * @this {TaskFabric|Task_Webpack}
 * @type {TaskFabric|Task_Webpack}
 * @param {Object} config
 * @param {Boolean} config.full
 * @param {Boolean} config.source_map
 * @param {String} config.source_map_type
 * @param {String} config.name
 * @param {String} config.from
 * @param {String} config.to
 * @param {String} callback
 */
Task_Webpack.prototype.run = function(config, callback) {
    var full = 'full' in config ? config['full'] : false;
    var babel = 'babel' in config ? config['babel'] : true;
    var sourceMap = 'source_map' in config ? config['source_map'] : true;
    var sourceMapType = 'source_map_type' in config ? config['source_map_type'] : 'inline';
    sourceMapType = sourceMapType === 'inline' ? 'inline-source-map' : 'source-map';

    if (CocktailOfTasks.isProduction) {
        sourceMap = false;
    }

    var path_to = this._path.get('to', config, this._defaultDirTo, true);
    var path_from = this._path.get('from', config, this._defaultDirFrom);

    var storage_name = config.name ? config.name : path_from;

    var filename_from = node_path.basename(path_from);
    path_from = node_path.dirname(path_from) + '/';

    var filename_to = filename_from;
    if (node_path.extname(path_to) != '') {
        filename_to = node_path.basename(path_to);
        path_to = node_path.dirname(path_to) + '/';
    }

    if (!(storage_name in Task_Webpack._storage)) {
        //var myDevConfigMin = Object.create(webpackConfig);
        var myDevConfigMin = JSON.parse(JSON.stringify(webpackConfig));
        myDevConfigMin.entry = path_from + filename_from;
        myDevConfigMin.output.path = path_to;
        myDevConfigMin.output.filename = filename_to;
        if (sourceMap) {
            myDevConfigMin.devtool = sourceMapType;
        }

        if (babel) {
            myDevConfigMin.module.rules.push({
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'buble-loader'
                    }
                ]
            });
        }

        if (!full && CocktailOfTasks.isProduction) {
            myDevConfigMin.plugins = [
                new webpack.optimize.UglifyJsPlugin({
                    sourceMap: sourceMap
                }),
                new webpack.LoaderOptionsPlugin({
                    debug: true
                })
                // new webpack.optimize.DedupePlugin(),
                // new webpack.optimize.UglifyJsPlugin()
            ];
        }

        Task_Webpack._storage[storage_name] = webpack(myDevConfigMin);
    }

    var _src = path_from + filename_from;
    var _dest = path_to + filename_to;
    var self = this;

    var list = [];
    if (sourceMap) {
        if (sourceMapType === 'source-map') {
            list.push('Source map: file');
        } else {
            list.push('Source map: inline');
        }
    }

    if (babel) {
        list.push('Babel');
    }

    if (!full && CocktailOfTasks.isProduction) {
        list.push('Compress');
    }

    Task_Webpack._storage[storage_name].run(function(err, stats) {
        if (err) {
            self.report(_src, _dest, false);
            console.log(err);
        } else {
            self.report(_src, _dest, true, list);
        }

        if (callback) {
            callback.call();
        }
    });
};

module.exports = function(Task) {
    return new Task_Webpack(Task);
};