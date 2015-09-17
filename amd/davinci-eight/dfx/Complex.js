define(["require", "exports", '../dfx/Simplex'], function (require, exports, Simplex) {
    /**
     * @class Complex
     */
    var Complex = (function () {
        //public boundingSphere: Sphere = new Sphere({x: 0, y: 0, z: 0}, Infinity);
        function Complex() {
            this.simplices = [];
            this.dynamic = true;
            this.verticesNeedUpdate = false;
            this.elementsNeedUpdate = false;
            this.uvsNeedUpdate = false;
        }
        Complex.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            // console.warn("Complex.mergeVertices not yet implemented");
        };
        Complex.prototype.boundary = function (count) {
            this.simplices = Simplex.boundary(this.simplices, count);
        };
        Complex.prototype.subdivide = function (count) {
            this.simplices = Simplex.subdivide(this.simplices, count);
        };
        return Complex;
    })();
    return Complex;
});
