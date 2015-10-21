var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/computeFaceNormals', '../math/Euclidean3', '../geometries/SimplexGeometry', '../geometries/quadrilateral', '../geometries/Simplex', '../core/Symbolic', '../geometries/triangle', '../math/MutableVectorE3'], function (require, exports, computeFaceNormals, Euclidean3, SimplexGeometry, quad, Simplex, Symbolic, triangle, MutableVectorE3) {
    /**
     * @module EIGHT
     * @submodule geometries
     * @class BarnSimplexGeometry
     */
    var BarnSimplexGeometry = (function (_super) {
        __extends(BarnSimplexGeometry, _super);
        /**
         * The basic barn similar to that described in "Computer Graphics using OpenGL", by Hill and Kelly.
         * Ten (10) vertices are used to define the barn.
         * The floor vertices are lablled 0, 1, 6, 5.
         * The corresponding ceiling vertices are labelled 4, 2, 7, 9.
         * The roof peak vertices are labelled 3, 8.
         * @class BarnSimplexGeometry
         * @constructor
         */
        function BarnSimplexGeometry() {
            _super.call(this, 'BarnSimplexGeometry');
            this.a = MutableVectorE3.copy(Euclidean3.e1);
            this.b = MutableVectorE3.copy(Euclidean3.e2);
            this.c = MutableVectorE3.copy(Euclidean3.e3);
            this.regenerate();
        }
        BarnSimplexGeometry.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        BarnSimplexGeometry.prototype.isModified = function () {
            return this.a.modified || this.b.modified || this.c.modified || _super.prototype.isModified.call(this);
        };
        BarnSimplexGeometry.prototype.setModified = function (modified) {
            this.a.modified = modified;
            this.b.modified = modified;
            this.c.modified = modified;
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        BarnSimplexGeometry.prototype.regenerate = function () {
            this.setModified(false);
            var points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (index) { return void 0; });
            points[0] = new MutableVectorE3().sub(this.a).sub(this.b).sub(this.c).divideByScalar(2);
            points[1] = new MutableVectorE3().add(this.a).sub(this.b).sub(this.c).divideByScalar(2);
            points[6] = new MutableVectorE3().add(this.a).sub(this.b).add(this.c).divideByScalar(2);
            points[5] = new MutableVectorE3().sub(this.a).sub(this.b).add(this.c).divideByScalar(2);
            points[4] = new MutableVectorE3().copy(points[0]).add(this.b);
            points[2] = new MutableVectorE3().copy(points[1]).add(this.b);
            points[7] = new MutableVectorE3().copy(points[6]).add(this.b);
            points[9] = new MutableVectorE3().copy(points[5]).add(this.b);
            points[3] = MutableVectorE3.lerp(points[4], points[2], 0.5).scale(2).add(this.b).divideByScalar(2);
            points[8] = MutableVectorE3.lerp(points[7], points[9], 0.5).scale(2).add(this.b).divideByScalar(2);
            function simplex(indices) {
                var simplex = new Simplex(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = points[indices[i]];
                }
                return simplex;
            }
            switch (this.k) {
                case 0:
                    {
                        var simplices = points.map(function (point) {
                            var simplex = new Simplex(0);
                            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = point;
                            return simplex;
                        });
                        this.data = simplices;
                    }
                    break;
                case 1:
                    {
                        var lines = [[0, 1], [1, 6], [6, 5], [5, 0], [1, 2], [6, 7], [5, 9], [0, 4], [4, 3], [3, 2], [9, 8], [8, 7], [9, 4], [8, 3], [7, 2]];
                        this.data = lines.map(function (line) { return simplex(line); });
                    }
                    break;
                case 2:
                    {
                        var faces = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (index) { return void 0; });
                        faces[0] = quad(points[0], points[5], points[9], points[4]);
                        faces[1] = quad(points[3], points[4], points[9], points[8]);
                        faces[2] = quad(points[2], points[3], points[8], points[7]);
                        faces[3] = quad(points[1], points[2], points[7], points[6]);
                        faces[4] = quad(points[0], points[1], points[6], points[5]);
                        faces[5] = quad(points[5], points[6], points[7], points[9]);
                        faces[6] = quad(points[0], points[4], points[2], points[1]);
                        faces[7] = triangle(points[9], points[7], points[8]);
                        faces[8] = triangle(points[2], points[4], points[3]);
                        this.data = faces.reduce(function (a, b) { return a.concat(b); }, []);
                        this.data.forEach(function (simplex) {
                            computeFaceNormals(simplex);
                        });
                    }
                    break;
                default: {
                }
            }
            // Compute the meta data.
            this.check();
        };
        return BarnSimplexGeometry;
    })(SimplexGeometry);
    return BarnSimplexGeometry;
});
