import Euclidean3 = require('davinci-blade/e3ga/Euclidean3');
import Unit = require('davinci-blade/Unit');

var pseudoscalarE3 = function(xyz: number, uom?: Unit): Euclidean3 {
  return new Euclidean3(0, 0, 0, 0, 0, 0, 0, xyz, uom);
};

export = pseudoscalarE3;
