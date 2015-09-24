import Euclidean3 = require('davinci-blade/e3ga/Euclidean3');
import Unit = require('davinci-blade/Unit');

var scalarE3 = function(w: number, uom?: Unit): Euclidean3 {
  return new Euclidean3(w, 0, 0, 0, 0, 0, 0, 0, uom);
};

export = scalarE3;
