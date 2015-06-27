/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
/// <reference path="Object3D.d.ts" />
import scalarE3 = require('davinci-eight/math/e3ga/scalarE3');
import vectorE3 = require('davinci-eight/math/e3ga/vectorE3');

var object3D = function(): Object3D {

  var publicAPI: Object3D = {
    position: vectorE3(0, 0, 0),
    attitude: scalarE3(1),
  };

  return publicAPI;
};

export = object3D;
