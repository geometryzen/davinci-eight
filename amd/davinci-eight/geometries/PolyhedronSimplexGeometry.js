var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../geometries/SimplexGeometry', '../geometries/Simplex', '../core/GraphicsProgramSymbols', '../math/R2', '../math/R3'], function (require, exports, Euclidean3_1, SimplexGeometry_1, Simplex_1, GraphicsProgramSymbols_1, R2_1, R3_1) {
    function azimuth(vector) {
        return Math.atan2(vector.z, -vector.x);
    }
    function inclination(pos) {
        return Math.atan2(-pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
    }
    function prepare(point, points) {
        var vertex = R3_1.default.copy(point).direction();
        points.push(vertex);
        var u = azimuth(point) / 2 / Math.PI + 0.5;
        var v = inclination(point) / Math.PI + 0.5;
        var something = vertex;
        something['uv'] = new R2_1.default([u, 1 - v]);
        return vertex;
    }
    function correctUV(uv, vector, azimuth) {
        if ((azimuth < 0) && (uv.x === 1))
            uv = new R2_1.default([uv.x - 1, uv.y]);
        if ((vector.x === 0) && (vector.z === 0))
            uv = new R2_1.default([azimuth / 2 / Math.PI + 0.5, uv.y]);
        return uv.clone();
    }
    var PolyhedronSimplexGeometry = (function (_super) {
        __extends(PolyhedronSimplexGeometry, _super);
        function PolyhedronSimplexGeometry(vertices, indices, radius, detail) {
            if (radius === void 0) { radius = 1; }
            if (detail === void 0) { detail = 0; }
            _super.call(this);
            var that = this;
            var points = [];
            for (var i = 0, l = vertices.length; i < l; i += 3) {
                prepare(new R3_1.default([vertices[i], vertices[i + 1], vertices[i + 2]]), points);
            }
            var faces = [];
            for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
                var v1 = points[indices[i]];
                var v2 = points[indices[i + 1]];
                var v3 = points[indices[i + 2]];
                var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v1;
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v1);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v2;
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v2);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v3;
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v3);
                faces[j] = simplex;
            }
            for (var i = 0, facesLength = faces.length; i < facesLength; i++) {
                subdivide(faces[i], detail, points);
            }
            for (var i = 0, verticesLength = points.length; i < verticesLength; i++) {
                points[i].x *= radius;
                points[i].y *= radius;
                points[i].z *= radius;
            }
            this.mergeVertices();
            function centroid(v1, v2, v3) {
                var x = (v1.x + v2.x + v3.x) / 3;
                var y = (v1.y + v2.y + v3.y) / 3;
                var z = (v1.z + v2.z + v3.z) / 3;
                return new Euclidean3_1.default(0, x, y, z, 0, 0, 0, 0);
            }
            function make(v1, v2, v3) {
                var azi = azimuth(centroid(v1, v2, v3));
                var something1 = v1;
                var something2 = v2;
                var something3 = v3;
                var uv1 = correctUV(something1['uv'], v1, azi);
                var uv2 = correctUV(something2['uv'], v2, azi);
                var uv3 = correctUV(something3['uv'], v3, azi);
                var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = R3_1.default.copy(v1);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v1);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uv1;
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = R3_1.default.copy(v2);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v2);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uv2;
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = R3_1.default.copy(v3);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v3);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uv3;
                that.data.push(simplex);
            }
            function subdivide(face, detail, points) {
                var cols = Math.pow(2, detail);
                var a = prepare(face.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
                var b = prepare(face.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
                var c = prepare(face.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
                var v = [];
                for (var i = 0; i <= cols; i++) {
                    v[i] = [];
                    var aj = prepare(R3_1.default.copy(a).lerp(c, i / cols), points);
                    var bj = prepare(R3_1.default.copy(b).lerp(c, i / cols), points);
                    var rows = cols - i;
                    for (var j = 0; j <= rows; j++) {
                        if (j == 0 && i == cols) {
                            v[i][j] = aj;
                        }
                        else {
                            v[i][j] = prepare(R3_1.default.copy(aj).lerp(bj, j / rows), points);
                        }
                    }
                }
                for (var i = 0; i < cols; i++) {
                    for (var j = 0; j < 2 * (cols - i) - 1; j++) {
                        var k = Math.floor(j / 2);
                        if (j % 2 == 0) {
                            make(v[i][k + 1], v[i + 1][k], v[i][k]);
                        }
                        else {
                            make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k]);
                        }
                    }
                }
            }
        }
        return PolyhedronSimplexGeometry;
    })(SimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PolyhedronSimplexGeometry;
});
