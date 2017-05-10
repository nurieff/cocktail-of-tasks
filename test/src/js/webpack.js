import {cube} from './webpack/import_maths.js';
let square = require('./webpack/require_maths').square;

class Test_Webpack {

    constructor() {
        this._cube = cube;
        this._square = square;
    }

    cube(x) {
        return this._cube(x)
    }

    square(x) {
        return this._square(x)
    }

}

let test = new Test_Webpack();
console.log(test.cube(5));
console.log(test.square(5));