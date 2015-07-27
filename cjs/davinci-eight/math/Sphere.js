var Vector3 = require('../math/Vector3');
var Sphere = (function () {
    function Sphere(center, radius) {
        this.center = (center !== undefined) ? center : new Vector3([0, 0, 0]);
        this.radius = (radius !== undefined) ? radius : 0;
    }
    Sphere.prototype.setFromPoints = function (points) {
        throw new Error("Not Implemented: Sphere.setFromPoints");
    };
    return Sphere;
})();
module.exports = Sphere;
