/**
 * @constructor
 */
function Path() {

}

Path.prototype = {

    get: function(type, config, default_dir, isPublic) {
        var dir = CocktailOfTasks.dir;

        var path;
        if (!(type in config)) {
            path = (isPublic ? dir.public : dir.assets) + default_dir + '/';
        } else if (config[type].indexOf('/') === 0) {
            path = dir.root + config[type].replace(/^\//, '');
        } else {
            path = (isPublic ? dir.public : dir.assets) + config[type];
        }

        return path;
    },

    assets: function(path) {
        if (path.indexOf('/') !== 0) {
            path = CocktailOfTasks.dir.assets + path;
        }

        return path;
    },

    public: function(path) {
        if (path.indexOf('/') !== 0) {
            path = CocktailOfTasks.dir.public + path;
        }

        return path;
    },

    init: function(path) {
        if (path.indexOf('/') !== 0) {
            path = CocktailOfTasks.dir.root + path;
        }

        return path;
    }

};

module.exports = function() {
    return new Path();
};