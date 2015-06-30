/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
/// <reference path="Object3D.d.ts" />
var scalarE3 = require('davinci-eight/math/e3ga/scalarE3');
var vectorE3 = require('davinci-eight/math/e3ga/vectorE3');
var object3D = function () {
    var publicAPI = {
        position: vectorE3(0, 0, 0),
        attitude: scalarE3(1),
    };
    return publicAPI;
};
module.exports = object3D;
