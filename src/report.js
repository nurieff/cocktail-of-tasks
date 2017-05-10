var CliTable = require('cli-table');
var chalk = require('chalk');

var Report = function() {

    this._reports = [];
};

var p = Report.prototype;

p.add = function(task, src, dest, success, list) {
    this._reports.push({
        task: {
            task: task,
            success: success
        },
        src: src,
        dest: dest,
        list: list && Array.isArray(list) ? list : [],
    });
};

p.draw = function() {

    if (this._reports.length < 1) {
        return;
    }

    var table = new CliTable({
        head: [
            "Task",
            "Source Files",
            "Destination",
            "Options",
        ]
    });

    this._reports.forEach(function(item) {
        table.push([
            (item.task.success ? chalk.green(item.task.task) : chalk.red(item.task.task)),

            (Array.isArray(item.src) ? item.src.map(function(i) {
                return i.replace(CocktailOfTasks.dir.root, '');
            }).join("\n") : item.src.replace(CocktailOfTasks.dir.root, '')),

            (Array.isArray(item.dest) ? item.dest.map(function(i) {
                return i.replace(CocktailOfTasks.dir.root, '');
            }).join("\n") : item.dest.replace(CocktailOfTasks.dir.root, '')),

            item.list.join("\n")
        ])
    });

    console.log(table.toString());

    this._reports = [];
};

module.exports = function() {
    return new Report();
};