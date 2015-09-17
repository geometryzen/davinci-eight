/**
 * @class Geometry
 */
var Geometry = (function () {
    //public boundingSphere: Sphere = new Sphere({x: 0, y: 0, z: 0}, Infinity);
    function Geometry() {
        //public simplices: Simplex[] = [];
        this.dynamic = true;
        this.verticesNeedUpdate = false;
        this.elementsNeedUpdate = false;
        this.uvsNeedUpdate = false;
    }
    Geometry.prototype.mergeVertices = function (precisionPoints) {
        if (precisionPoints === void 0) { precisionPoints = 4; }
        console.warn("Geometry.mergeVertices not yet implemented");
    };
    return Geometry;
})();
module.exports = Geometry;
