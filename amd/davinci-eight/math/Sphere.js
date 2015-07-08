define(["require", "exports", '../math/Vector3'], function (require, exports, Vector3) {
    var Sphere = (function () {
        function Sphere(center, radius) {
            this.center = (center !== undefined) ? center : new Vector3();
            this.radius = (radius !== undefined) ? radius : 0;
        }
        Sphere.prototype.setFromPoints = function (points) {
            throw new Error("Not Implemented: Sphere.setFromPoints");
        };
        return Sphere;
    })();
    return Sphere;
});