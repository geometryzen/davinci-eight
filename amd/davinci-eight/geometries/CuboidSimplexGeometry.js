var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/CartesianE3', '../geometries/computeFaceNormals', '../geometries/SimplexGeometry', '../geometries/quadrilateral', '../geometries/Simplex', '../core/GraphicsProgramSymbols', '../math/R1', '../math/R3'], function (require, exports, CartesianE3_1, computeFaceNormals_1, SimplexGeometry_1, quadrilateral_1, Simplex_1, GraphicsProgramSymbols_1, R1_1, R3_1) {
    var CuboidSimplexGeometry = (function (_super) {
        __extends(CuboidSimplexGeometry, _super);
        function CuboidSimplexGeometry(a, b, c, k, subdivide, boundary) {
            if (a === void 0) { a = CartesianE3_1.default.e1; }
            if (b === void 0) { b = CartesianE3_1.default.e2; }
            if (c === void 0) { c = CartesianE3_1.default.e3; }
            if (k === void 0) { k = Simplex_1.default.TRIANGLE; }
            if (subdivide === void 0) { subdivide = 0; }
            if (boundary === void 0) { boundary = 0; }
            _super.call(this);
            this._isModified = true;
            this._a = CartesianE3_1.default.fromVectorE3(a);
            this._b = CartesianE3_1.default.fromVectorE3(b);
            this._c = CartesianE3_1.default.fromVectorE3(c);
            this.k = k;
            this.subdivide(subdivide);
            this.boundary(boundary);
            this.regenerate();
        }
        Object.defineProperty(CuboidSimplexGeometry.prototype, "a", {
            get: function () {
                return this._a;
            },
            set: function (a) {
                this._a = a;
                this._isModified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidSimplexGeometry.prototype, "b", {
            get: function () {
                return this._b;
            },
            set: function (b) {
                this._b = b;
                this._isModified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidSimplexGeometry.prototype, "c", {
            get: function () {
                return this._c;
            },
            set: function (c) {
                this._c = c;
                this._isModified = true;
            },
            enumerable: true,
            configurable: true
        });
        CuboidSimplexGeometry.prototype.isModified = function () {
            return this._isModified || _super.prototype.isModified.call(this);
        };
        CuboidSimplexGeometry.prototype.setModified = function (modified) {
            this._isModified = modified;
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        CuboidSimplexGeometry.prototype.regenerate = function () {
            this.setModified(false);
            var pos = [0, 1, 2, 3, 4, 5, 6, 7].map(function (index) { return void 0; });
            pos[0] = new R3_1.default().sub(this._a).sub(this._b).add(this._c).divByScalar(2);
            pos[1] = new R3_1.default().add(this._a).sub(this._b).add(this._c).divByScalar(2);
            pos[2] = new R3_1.default().add(this._a).add(this._b).add(this._c).divByScalar(2);
            pos[3] = new R3_1.default().sub(this._a).add(this._b).add(this._c).divByScalar(2);
            pos[4] = new R3_1.default().copy(pos[3]).sub(this._c);
            pos[5] = new R3_1.default().copy(pos[2]).sub(this._c);
            pos[6] = new R3_1.default().copy(pos[1]).sub(this._c);
            pos[7] = new R3_1.default().copy(pos[0]).sub(this._c);
            var position = this.position;
            pos.forEach(function (point) {
                point.add(position);
            });
            function simplex(indices) {
                var simplex = new Simplex_1.default(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = pos[indices[i]];
                    simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_GEOMETRY_INDEX] = new R1_1.default([i]);
                }
                return simplex;
            }
            switch (this.k) {
                case 0:
                    {
                        var points = [[0], [1], [2], [3], [4], [5], [6], [7]];
                        this.data = points.map(function (point) { return simplex(point); });
                    }
                    break;
                case 1:
                    {
                        var lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]];
                        this.data = lines.map(function (line) { return simplex(line); });
                    }
                    break;
                case 2:
                    {
                        var faces = [0, 1, 2, 3, 4, 5].map(function (index) { return void 0; });
                        faces[0] = quadrilateral_1.default(pos[0], pos[1], pos[2], pos[3]);
                        faces[1] = quadrilateral_1.default(pos[1], pos[6], pos[5], pos[2]);
                        faces[2] = quadrilateral_1.default(pos[7], pos[0], pos[3], pos[4]);
                        faces[3] = quadrilateral_1.default(pos[6], pos[7], pos[4], pos[5]);
                        faces[4] = quadrilateral_1.default(pos[3], pos[2], pos[5], pos[4]);
                        faces[5] = quadrilateral_1.default(pos[7], pos[6], pos[1], pos[0]);
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
        return CuboidSimplexGeometry;
    })(SimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CuboidSimplexGeometry;
});
