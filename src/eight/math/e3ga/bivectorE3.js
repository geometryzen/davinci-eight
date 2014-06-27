define(["require", "exports", 'eight/math/e3ga/Euclidean3'], function(require, exports, Euclidean3) {
    var bivectorE3 = function (xy, yz, zx) {
        return new Euclidean3(0, 0, 0, 0, xy, yz, zx, 0);
    };
    
    return bivectorE3;
});
