import euclidean3 = require('eight/math/e3ga/euclidean3');

var bivectorE3 = function(xy: number, yz: number, zx: number): Euclidean3 {
    return euclidean3({ xy: xy, yz: yz, zx: zx });
};

export = bivectorE3;
