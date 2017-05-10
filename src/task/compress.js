/**
 * Если будет плохо работать
 * npm uninstall gulp-imagemin
 * npm uninstall imagemin-pngquant
 * @type {*}
 */
var imagemin = require('gulp-imagemin')
    , glob = require('glob')
    , imageminPngquant = require('imagemin-pngquant')
    , imageminMozjpeg = require('imagemin-mozjpeg')
;

/**
 * @constructor
 */
function Task_Compress(Task) {
    CocktailOfTasks.TaskFabric.apply(this, arguments);

    this._default_config = 'compress';
    this._defaultDirFrom = 'images';
    this._defaultDirTo = 'images';

    /**
     * @type {Object.<String,{src: Array, to: String, completeAmount: Number}>}
     * @private
     */
    this._reportsOfCompress = {};
}

/**
 * @this {CocktailOfTasks.TaskFabric|Task_Compress}
 * @type {CocktailOfTasks.TaskFabric|Task_Compress}
 */
Task_Compress.prototype = Object.create(CocktailOfTasks.TaskFabric.prototype);
Task_Compress.prototype.constructor = Task_Compress;

/**
 * @todo сделать классный конфиг
 * @this {Task_Fabric|Task_Compress}
 * @type {Task_Fabric|Task_Compress}
 */
Task_Compress.prototype.run = function(config) {
    var path_to = this._path.get('to', config, this._defaultDirTo, true);
    var path_from = this._path.get('from', config, this._defaultDirFrom);

    var imageminCfg = {
        png: {
            quality: '60-70',
            speed: 1
        },
        jpeg: {
            quality: 60,
            //targa: true
        }
    };

    ['png', 'jpg'].forEach(function(c) {
        if (!(c in config)) return;

        var _ci;
        for (_ci in imageminCfg[c]) {
            if (!imageminCfg[c].hasOwnProperty(_ci)) continue;

            if (_ci in config[c]) {
                imageminCfg[c][_ci] = config[c][_ci]
            }
        }
    });

    var stream = [];

    var from, to, images, imagesList;
    for (var i = 0, l = config.images.length; i < l; ++i) {

        images = config.images[i];

        if (Object.prototype.toString.call(images) === '[object Object]') {
            from = images.from.indexOf('/') !== 0 ? path_from + images.from : images.from;
            to = images.to.indexOf('/') !== 0 ? path_to + images.to : images.to;
        } else {
            from = images.indexOf('/') !== 0 ? path_from + images : images;
            to = path_to;
        }

        imagesList = glob.sync(from);

        this._reportsOfCompress[from] = {
            src: imagesList,
            to: to,
            completeAmount: 0
        };

        stream.push(CocktailOfTasks.gulp.src(from)
            .pipe(imagemin([
                imageminMozjpeg(imageminCfg.jpeg),
                imageminPngquant(imageminCfg.png)
            ]))
            .pipe(CocktailOfTasks.gulp.dest(to))
            .pipe(CocktailOfTasks.notify(this.reportOfCompress.bind(this, from))));
    }

    return stream;
};

Task_Compress.prototype.reportOfCompress = function(src) {

    if (!(src in this._reportsOfCompress)) {
        return;
    }

    ++this._reportsOfCompress[src].completeAmount;

    if (this._reportsOfCompress[src].completeAmount >= this._reportsOfCompress[src].src.length) {
        this.report(
            this._reportsOfCompress[src].src,
            this._reportsOfCompress[src].to,
            true
        );

        delete this._reportsOfCompress[src];
    }
};

module.exports = function(Task) {
    return new Task_Compress(Task);
};