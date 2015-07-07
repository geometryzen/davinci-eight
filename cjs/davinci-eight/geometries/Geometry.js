var Geometry = (function () {
    function Geometry() {
        this.vertices = [];
        this.verticesNeedUpdate = true;
        this.faces = [];
        this.elementsNeedUpdate = true;
        this.dynamic = true;
    }
    Geometry.prototype.computeBoundingSphere = function () {
    };
    return Geometry;
})();
module.exports = Geometry;
