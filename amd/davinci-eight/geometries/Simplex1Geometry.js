var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/SimplexGeometry', '../geometries/Simplex', '../core/Symbolic', '../math/MutableVectorE3'], function (require, exports, SimplexGeometry, Simplex, Symbolic, MutableVectorE3) {
    //import VectorN = require('../math/VectorN')
    /**
     * @class Simplex1Geometry
     */
    var Simplex1Geometry = (function (_super) {
        __extends(Simplex1Geometry, _super);
        /**
         * @class Simplex1Geometry
         * @constructor
         */
        function Simplex1Geometry() {
            _super.call(this);
            this.head = new MutableVectorE3([1, 0, 0]);
            this.tail = new MutableVectorE3([0, 1, 0]);
            this.calculate();
        }
        Simplex1Geometry.prototype.calculate = function () {
            var pos = [0, 1].map(function (index) { return void 0; });
            pos[0] = this.tail;
            pos[1] = this.head;
            function simplex(indices) {
                var simplex = new Simplex(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = pos[indices[i]];
                }
                return simplex;
            }
            this.data = [[0, 1]].map(function (line) { return simplex(line); });
            // Compute the meta data.
            this.check();
        };
        return Simplex1Geometry;
    })(SimplexGeometry);
    return Simplex1Geometry;
});
