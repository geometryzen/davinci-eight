import G3 = require('../math/G3');
import Unit = require('../math/Unit');

var scalarE3 = function(w: number, uom?: Unit): G3 {
  return new G3(w, 0, 0, 0, 0, 0, 0, 0, uom);
};

export = scalarE3;
