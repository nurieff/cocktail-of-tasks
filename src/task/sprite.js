var spritesmith = require('gulp.spritesmith')
    , imagemin = require('gulp-imagemin')
    , imageminPngquant = require('imagemin-pngquant')
    , imageminMozjpeg = require('imagemin-mozjpeg')
    , buffer = require('vinyl-buffer')
    , node_path = require('path')
;

/**
 * @constructor
 */
function Task_Sprite(Task) {
    CocktailOfTasks.TaskFabric.apply(this, arguments);

    this._default_config = 'sprite';
    this._defaultDirFrom = 'images';
    this._defaultDirTo = 'images';

    this._reportOfSprites = {};
}

/**
 * @this {Task_Fabric|Task_Sprite}
 * @type {Task_Fabric|Task_Sprite}
 */
Task_Sprite.prototype = Object.create(CocktailOfTasks.TaskFabric.prototype);
Task_Sprite.prototype.constructor = Task_Sprite;

/**
 * @todo сделать классный конфиг
 * @this {Task_Fabric|Task_Sprite}
 * @type {Task_Fabric|Task_Sprite}
 */
Task_Sprite.prototype.run = function(config) {
    var path_to_images = this._path.get('images', config.to, 'images', true);
    var path_to_css = this._path.get('css', config.to, 'css', true);

    var arrPathToImages = path_to_images.split('/');
    var arrPathToCss = path_to_css.split('/');

    var same = [];
    var diff = [];
    var toImages;
    var toCss;
    for (var i = 0, l = arrPathToCss.length; i < l; ++i) {
        if (diff.length == 0 && arrPathToCss[i] == arrPathToImages[i]) {
            same.push(arrPathToCss[i]);
        } else {
            toImages = arrPathToImages.slice(i).join('/');
            toCss = arrPathToCss.slice(i).join('/');
            path_to_images = arrPathToImages.slice(0, i).join('/');
            path_to_css = arrPathToCss.slice(0, i).join('/');
            break;
        }
    }

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

    var padding = 'padding' in config ? config.padding : 1;

    var cssFormat = false;
    var cssExtension = 'css';
    if ('css' in config) {
        // json_texture json json_array css scss sass less
        if (('format' in config.css) && config.css.format) {
            cssFormat = config.css.format;
        }
        if (('extension' in config.css) && config.css.extension) {
            cssExtension = config.css.extension;
        }
    }

    var _src, _destImage, _destCSS, _extImage, name;
    var spriteData;
    var _cfg;

    var stream = [];

    for (name in config.sprites) {
        if (!config.sprites.hasOwnProperty(name)) continue;

        _src = CocktailOfTasks.path.assets(config.sprites[name]);

        _extImage = node_path.extname(_src);

        _destImage = path_to_images + '/' + toImages + name + _extImage;
        _destCSS = path_to_css + '/' + toCss + name + '.' + cssExtension;

        _cfg = {
            imgName: toImages + name + _extImage,
            cssName: toCss + name + '.' + cssExtension,
            algorithm: 'binary-tree',
            padding: padding
        };

        if (cssFormat) {
            _cfg['cssFormat'] = cssFormat;
        }

        spriteData = CocktailOfTasks.gulp.src(_src)
            .pipe(spritesmith(_cfg));

        stream.push(spriteData.img
            .pipe(buffer())
            .pipe(imagemin(
                [
                    imageminMozjpeg(imageminCfg.jpeg),
                    imageminPngquant(imageminCfg.png)
                ]
            ))
            .pipe(CocktailOfTasks.gulp.dest(path_to_images))
            .pipe(CocktailOfTasks.notify(this.reportOfSprite.bind(this, 'img', _src, _destImage)))
        )
        ;

        stream.push(spriteData.css
            .pipe(CocktailOfTasks.gulp.dest(path_to_css))
            .pipe(CocktailOfTasks.notify(this.reportOfSprite.bind(this, 'css', _src, _destCSS)))
        )
        ;

    }

    return stream;
};

Task_Sprite.prototype.reportOfSprite = function(type, src, dest) {

    if (!(src in this._reportOfSprites)) {
        this._reportOfSprites[src] = {
            css: null,
            img: null
        };
    }

    this._reportOfSprites[src][type] = dest;

    if (this._reportOfSprites[src].css && this._reportOfSprites[src].img) {
        this.report(src, [
            this._reportOfSprites[src].img,
            this._reportOfSprites[src].css
        ], true);

        delete this._reportOfSprites[src];
    }
};


module.exports = function(Task) {
    return new Task_Sprite(Task);
};