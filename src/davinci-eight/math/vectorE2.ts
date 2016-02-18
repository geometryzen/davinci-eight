import G2 = require('../math/G2');
import Unit = require('../math/Unit');

var vectorE2 = function(x: number, y: number, uom?: Unit): G2 {
  return new G2(0, x, y, 0, uom);
};

export = vectorE2;
