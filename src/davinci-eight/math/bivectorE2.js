import G2 = require('davinci-blade/e2ga/G2');
import Unit = require('davinci-blade/Unit');

var bivectorE2 = function(xy: number, uom?: Unit): G2 {
  return new G2(0, 0, 0, xy, uom);
};

export = bivectorE2;
