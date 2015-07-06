define(["require", "exports"], function (require, exports) {
    var Geometry = (function () {
        function Geometry() {
            this.vertices = [];
            this.verticesNeedUpdate = true;
            this.faces = [];
            this.elementsNeedUpdate = true;
        }
        Geometry.prototype.computeBoundingSphere = function () {
        };
        return Geometry;
    })();
    return Geometry;
});
