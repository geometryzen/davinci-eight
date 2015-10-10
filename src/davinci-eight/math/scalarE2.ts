import Euclidean2 = require('../math/Euclidean2');
import Unit = require('../math/Unit');

var scalarE2 = function(w: number, uom?: Unit): Euclidean2 {
  return new Euclidean2(w, 0, 0, 0, uom);
};

export = scalarE2;
