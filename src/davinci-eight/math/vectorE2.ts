import Euclidean2 = require('davinci-blade/e2ga/Euclidean2');
import Unit = require('davinci-blade/Unit');

var vectorE2 = function(x: number, y: number, uom?: Unit): Euclidean2 {
  return new Euclidean2(0, x, y, 0, uom);
};

export = vectorE2;
