import Euclidean3 = require('../math/Euclidean3');
import Unit = require('../math/Unit');

var scalarE3 = function(w: number, uom?: Unit): Euclidean3 {
  return new Euclidean3(w, 0, 0, 0, 0, 0, 0, 0, uom);
};

export = scalarE3;
