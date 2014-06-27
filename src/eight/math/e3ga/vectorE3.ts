import Euclidean3 = require('eight/math/e3ga/Euclidean3');

var vectorE3 = function(x: number, y: number, z: number): Euclidean3 {
    return new Euclidean3(0, x, y, z, 0, 0, 0, 0);
};
export = vectorE3;
