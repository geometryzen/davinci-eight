define(["require", "exports", 'eight/math/e3ga/euclidean3'], function(require, exports, euclidean3) {
    var vectorE3 = function (x, y, z) {
        return euclidean3({ 'x': x, 'y': y, 'z': z });
    };

    
    return vectorE3;
});
