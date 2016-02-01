define(["require", "exports"], function (require, exports) {
    var sqrt = Math.sqrt;
    function rotorFromDirections(a, b, quad, dot, m) {
        var quadA = quad(a);
        var absA = sqrt(quadA);
        var quadB = quad(b);
        var absB = sqrt(quadB);
        var BA = absB * absA;
        var denom = sqrt(2 * (quadB * quadA + BA * dot(b, a)));
        if (denom !== 0) {
            m = m.spinor(b, a);
            m = m.addScalar(BA);
            m = m.divByScalar(denom);
            return m;
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rotorFromDirections;
});
