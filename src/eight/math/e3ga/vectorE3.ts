import euclidean3 = require('eight/math/e3ga/euclidean3');

var vectorE3 = function(x: number, y: number, z: number) {
    return euclidean3({ 'x': x, 'y': y, 'z': z });
};

export = vectorE3;
