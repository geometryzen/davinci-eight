define(["require", "exports", 'eight/math/e3ga/euclidean3'], function(require, exports, euclidean3) {
    var bivectorE3 = function (xy, yz, zx) {
        return euclidean3({ xy: xy, yz: yz, zx: zx });
    };

    
    return bivectorE3;
});
