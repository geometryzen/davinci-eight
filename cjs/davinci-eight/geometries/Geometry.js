var Simplex = require('../dfx/Simplex');
/**
 * @class Geometry
 */
var Geometry = (function () {
    //public boundingSphere: Sphere = new Sphere({x: 0, y: 0, z: 0}, Infinity);
    function Geometry() {
        this.simplices = [];
        this.dynamic = true;
        this.verticesNeedUpdate = false;
        this.elementsNeedUpdate = false;
        this.uvsNeedUpdate = false;
    }
    Geometry.prototype.mergeVertices = function (precisionPoints) {
        if (precisionPoints === void 0) { precisionPoints = 4; }
        console.warn("Geometry.mergeVertices not yet implemented");
    };
    Geometry.prototype.boundary = function (count) {
        this.simplices = Simplex.boundary(this.simplices, count);
    };
    Geometry.prototype.subdivide = function (count) {
        this.simplices = Simplex.subdivide(this.simplices, count);
    };
    return Geometry;
})();
module.exports = Geometry;
