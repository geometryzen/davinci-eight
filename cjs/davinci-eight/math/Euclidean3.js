// Considering new ideas for a totally immutable Euclidean3 value type.
var Euclidean3 = (function () {
    // The constructor is essentially for internal use.
    function Euclidean3(w, x, y, z) {
    }
    // It's a bit dangerous, but it might let us coexist with other types.
    // Another possibility is to write specialized mapping functions.
    Euclidean3.prototype.copy = function (coords) {
    };
    Euclidean3.prototype.add = function (other) {
        return new Euclidean3(0, 0, 0, 0);
    };
    Euclidean3.prototype.sub = function (other) {
        return new Euclidean3(0, 0, 0, 0);
    };
    Euclidean3.prototype.mul = function (other) {
        return new Euclidean3(0, 0, 0, 0);
    };
    Euclidean3.prototype.div = function (other) {
        return new Euclidean3(0, 0, 0, 0);
    };
    Euclidean3.scalar = function (w) {
        return new Euclidean3(w, 0, 0, 0);
    };
    Euclidean3.vector = function (x, y, z) {
        return new Euclidean3(0, x, y, z);
    };
    Euclidean3.ZERO = Euclidean3.scalar(0);
    Euclidean3.ONE = Euclidean3.scalar(1);
    Euclidean3.MINUS_ONE = Euclidean3.scalar(-1);
    Euclidean3.TWO = Euclidean3.scalar(2);
    Euclidean3.e1 = Euclidean3.vector(1, 0, 0);
    Euclidean3.e2 = Euclidean3.vector(0, 1, 0);
    Euclidean3.e3 = Euclidean3.vector(0, 1, 0);
    return Euclidean3;
})();
module.exports = Euclidean3;
