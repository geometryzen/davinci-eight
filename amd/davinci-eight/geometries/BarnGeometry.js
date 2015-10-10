var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/computeFaceNormals', '../geometries/Geometry', '../checks/mustBeInteger', '../geometries/quadrilateral', '../geometries/Simplex', '../core/Symbolic', '../geometries/triangle', '../math/Vector1', '../math/Vector3'], function (require, exports, computeFaceNormals, Geometry, mustBeInteger, quad, Simplex, Symbolic, triangle, Vector1, Vector3) {
    /**
     * @module EIGHT
     * @submodule geometries
     * @class BarnGeometry
     */
    var BarnGeometry = (function (_super) {
        __extends(BarnGeometry, _super);
        /**
         * The basic barn similar to that described in "Computer Graphics using OpenGL", by Hill and Kelly.
         * Ten (10) vertices are used to define the barn.
         * The floor vertices are lablled 0, 1, 6, 5.
         * The corresponding ceiling vertices are labelled 4, 2, 7, 9.
         * The roof peak vertices are labelled 3, 8.
         * @class BarnGeometry
         * @constructor
         */
        function BarnGeometry(type) {
            if (type === void 0) { type = 'BarnGeometry'; }
            _super.call(this, type);
            this.a = Vector3.e1.clone();
            this.b = Vector3.e2.clone();
            this.c = Vector3.e3.clone();
            this._k = new Vector1([Simplex.K_FOR_TRIANGLE]);
            this.recalculate();
        }
        Object.defineProperty(BarnGeometry.prototype, "k", {
            get: function () {
                return this._k.x;
            },
            set: function (k) {
                this._k.x = mustBeInteger('k', k);
            },
            enumerable: true,
            configurable: true
        });
        BarnGeometry.prototype.isModified = function () {
            return this.a.modified || this.b.modified || this.c.modified || this._k.modified;
        };
        BarnGeometry.prototype.setModified = function (modified) {
            this.a.modified = modified;
            this.b.modified = modified;
            this.c.modified = modified;
            this._k.modified = modified;
        };
        BarnGeometry.prototype.recalculate = function () {
            this.setModified(false);
            var points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (index) { return void 0; });
            points[0] = new Vector3().sub(this.a).sub(this.b).sub(this.c).divideScalar(2);
            points[1] = new Vector3().add(this.a).sub(this.b).sub(this.c).divideScalar(2);
            points[6] = new Vector3().add(this.a).sub(this.b).add(this.c).divideScalar(2);
            points[5] = new Vector3().sub(this.a).sub(this.b).add(this.c).divideScalar(2);
            points[4] = new Vector3().copy(points[0]).add(this.b);
            points[2] = new Vector3().copy(points[1]).add(this.b);
            points[7] = new Vector3().copy(points[6]).add(this.b);
            points[9] = new Vector3().copy(points[5]).add(this.b);
            points[3] = Vector3.lerp(points[4], points[2], 0.5).scale(2).add(this.b).divideScalar(2);
            points[8] = Vector3.lerp(points[7], points[9], 0.5).scale(2).add(this.b).divideScalar(2);
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
        return BarnGeometry;
    })(Geometry);
    return BarnGeometry;
});
