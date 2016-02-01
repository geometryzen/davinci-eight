var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/computeFaceNormals', '../math/Euclidean3', '../geometries/SimplexGeometry', '../geometries/quadrilateral', '../geometries/Simplex', '../core/GraphicsProgramSymbols', '../geometries/triangle', '../math/G3'], function (require, exports, computeFaceNormals_1, Euclidean3_1, SimplexGeometry_1, quadrilateral_1, Simplex_1, GraphicsProgramSymbols_1, triangle_1, G3_1) {
    var BarnSimplexGeometry = (function (_super) {
        __extends(BarnSimplexGeometry, _super);
        function BarnSimplexGeometry() {
            _super.call(this);
            this.a = G3_1.default.fromVector(Euclidean3_1.default.e1);
            this.b = G3_1.default.fromVector(Euclidean3_1.default.e2);
            this.c = G3_1.default.fromVector(Euclidean3_1.default.e3);
            this.regenerate();
        }
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
            points[0] = new G3_1.default().sub(this.a).sub(this.b).sub(this.c).divByScalar(2);
            points[1] = new G3_1.default().add(this.a).sub(this.b).sub(this.c).divByScalar(2);
            points[6] = new G3_1.default().add(this.a).sub(this.b).add(this.c).divByScalar(2);
            points[5] = new G3_1.default().sub(this.a).sub(this.b).add(this.c).divByScalar(2);
            points[4] = new G3_1.default().copy(points[0]).add(this.b);
            points[2] = new G3_1.default().copy(points[1]).add(this.b);
            points[7] = new G3_1.default().copy(points[6]).add(this.b);
            points[9] = new G3_1.default().copy(points[5]).add(this.b);
            points[3] = G3_1.default.lerp(points[4], points[2], 0.5).scale(2).add(this.b).divByScalar(2);
            points[8] = G3_1.default.lerp(points[7], points[9], 0.5).scale(2).add(this.b).divByScalar(2);
            var position = G3_1.default.fromVector(this.position);
            points = points.map(function (point) { return point.add(position); });
            function simplex(indices) {
                var simplex = new Simplex_1.default(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[indices[i]];
                }
                return simplex;
            }
            switch (this.k) {
                case 0:
                    {
                        var simplices = points.map(function (point) {
                            var simplex = new Simplex_1.default(0);
                            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = point;
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
                        faces[0] = quadrilateral_1.default(points[0], points[5], points[9], points[4]);
                        faces[1] = quadrilateral_1.default(points[3], points[4], points[9], points[8]);
                        faces[2] = quadrilateral_1.default(points[2], points[3], points[8], points[7]);
                        faces[3] = quadrilateral_1.default(points[1], points[2], points[7], points[6]);
                        faces[4] = quadrilateral_1.default(points[0], points[1], points[6], points[5]);
                        faces[5] = quadrilateral_1.default(points[5], points[6], points[7], points[9]);
                        faces[6] = quadrilateral_1.default(points[0], points[4], points[2], points[1]);
                        faces[7] = triangle_1.default(points[9], points[7], points[8]);
                        faces[8] = triangle_1.default(points[2], points[4], points[3]);
                        this.data = faces.reduce(function (a, b) { return a.concat(b); }, []);
                        this.data.forEach(function (simplex) {
                            computeFaceNormals_1.default(simplex);
                        });
                    }
                    break;
                default: {
                }
            }
            this.check();
        };
        return BarnSimplexGeometry;
    })(SimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BarnSimplexGeometry;
});
