import Euclidean3 = require('davinci-blade/e3ga/Euclidean3');
import Unit = require('davinci-blade/Unit');

var vectorE3 = function(x: number, y: number, z: number, uom?: Unit): Euclidean3 {
  return new Euclidean3(0, x, y, z, 0, 0, 0, 0, uom);
};

export = vectorE3;
