import Euclidean2 = require('davinci-blade/e2ga/Euclidean2');
import Unit = require('davinci-blade/Unit');

var scalarE2 = function(w: number, uom?: Unit): Euclidean2 {
  return new Euclidean2(w, 0, 0, 0, uom);
};

export = scalarE2;
