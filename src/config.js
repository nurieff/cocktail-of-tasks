var storage = {};

/**
 * @param config_name
 * @param type
 * @return {Array|{name:string}}
 */
module.exports = function(config_name, type) {
    var config_path;
    var config_key;

    if (Object.prototype.toString.call(config_name) === '[object Object]') {
        //console.log('Config name is object');
        return config_name;
    }

    if (!config_name) {
        console.log(type + ': default config (config name is null)');
        return null;
    }

    if (config_name in storage) {
        return storage[config_name];
    }

    if (config_name.indexOf(".") !== -1) {
        var config_nameArr = config_name.split('.', 2);
        config_name = config_nameArr[0];
        config_key = config_nameArr[1];
    }

    config_path = CocktailOfTasks.dir.assets + config_name + '.json';

    try {
        var cfg = require(config_path);
    } catch (e) {
        console.log(type + ': default config (Not found ' + config_path + ')');
        return null;
    }

    console.log(type + ': config: ' + config_path);

    if (config_key && (cfg instanceof Array)) {
        for (var i = 0, l = cfg.length; i < l; ++i) {
            if (!('name' in cfg[i])) continue;

            if (cfg[i].name == config_key) {
                console.log(type + ': config key: ' + config_key);
                cfg = cfg[i];
                break;
            }
        }
    }

    return storage[config_name] = cfg;
};