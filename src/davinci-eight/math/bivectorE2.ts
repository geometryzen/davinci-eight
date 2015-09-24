import Euclidean2 = require('davinci-blade/e2ga/Euclidean2');
import Unit = require('davinci-blade/Unit');

var bivectorE2 = function(xy: number, uom?: Unit): Euclidean2 {
  return new Euclidean2(0, 0, 0, xy, uom);
};

export = bivectorE2;
