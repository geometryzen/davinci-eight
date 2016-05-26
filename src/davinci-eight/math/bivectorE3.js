import {G3} from require('davinci-blade/e3ga/G3');
import {Unit} = require('davinci-blade/Unit');

var bivectorE3 = function(xy: number, yz: number, zx: number, uom?: Unit): G3 {
  return new G3(0, 0, 0, 0, xy, yz, zx, 0, uom);
};

export = bivectorE3;
