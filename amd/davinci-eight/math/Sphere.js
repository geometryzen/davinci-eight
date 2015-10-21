define(["require", "exports", '../math/Euclidean3'], function (require, exports, Euclidean3) {
    var Sphere = (function () {
        function Sphere(center, radius) {
            if (center === void 0) { center = Euclidean3.zero; }
            if (radius === void 0) { radius = 0; }
            this.center = center;
            this.radius = radius;
        }
        Sphere.prototype.setFromPoints = function (points) {
            throw new Error("Not Implemented: Sphere.setFromPoints");
        };
        return Sphere;
    })();
    return Sphere;
});
