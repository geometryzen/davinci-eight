import G2 = require('../math/G2');
import Unit = require('../math/Unit');

var scalarE2 = function(w: number, uom?: Unit): G2 {
  return new G2(w, 0, 0, 0, uom);
};

export = scalarE2;
