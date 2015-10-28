import Euclidean3 = require('davinci-eight/math/Euclidean3');
import Unit = require('davinci-eight/math/Unit');

var pseudoscalarE3 = function(β: number, uom?: Unit): Euclidean3 {
    return new Euclidean3(0, 0, 0, 0, 0, 0, 0, β, uom);
};

export = pseudoscalarE3;
