define(["require", "exports"], function (require, exports) {
    var Sphere = (function () {
        function Sphere(center, radius) {
            this.center = (center !== undefined) ? center : { x: 0, y: 0, z: 0 };
            this.radius = (radius !== undefined) ? radius : 0;
        }
        Sphere.prototype.setFromPoints = function (points) {
            throw new Error("Not Implemented: Sphere.setFromPoints");
        };
        return Sphere;
    })();
    return Sphere;
});
