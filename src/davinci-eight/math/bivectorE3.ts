import Euclidean3 = require('davinci-blade/e3ga/Euclidean3');
import Unit = require('davinci-blade/Unit');

var bivectorE3 = function(xy: number, yz: number, zx: number, uom?: Unit): Euclidean3 {
  return new Euclidean3(0, 0, 0, 0, xy, yz, zx, 0, uom);
};

export = bivectorE3;
