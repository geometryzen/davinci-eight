import euclidean3 = require('eight/math/e3ga/euclidean3');

var scalarE3 = function(w: number): Euclidean3 {
    return euclidean3({ 'w': w });
};

export = scalarE3;
