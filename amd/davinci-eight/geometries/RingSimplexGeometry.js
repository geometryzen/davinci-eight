var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/arc3', '../geometries/Simplex', '../geometries/SliceSimplexGeometry', '../math/SpinG3', '../core/GraphicsProgramSymbols', '../math/R2', '../math/R3'], function (require, exports, arc3_1, Simplex_1, SliceSimplexGeometry_1, SpinG3_1, GraphicsProgramSymbols_1, R2_1, R3_1) {
    function computeVertices(a, b, axis, start, angle, generator, radialSegments, thetaSegments, vertices, uvs) {
        var perp = R3_1.default.copy(axis).cross(start);
        var radius = b;
        var radiusStep = (a - b) / radialSegments;
        for (var i = 0; i < radialSegments + 1; i++) {
            var begin = R3_1.default.copy(start).scale(radius);
            var arcPoints = arc3_1.default(begin, angle, generator, thetaSegments);
            for (var j = 0, jLength = arcPoints.length; j < jLength; j++) {
                var arcPoint = arcPoints[j];
                vertices.push(arcPoint);
                uvs.push(new R2_1.default([(arcPoint.dot(start) / a + 1) / 2, (arcPoint.dot(perp) / a + 1) / 2]));
            }
            radius += radiusStep;
        }
    }
    function vertexIndex(i, j, thetaSegments) {
        return i * (thetaSegments + 1) + j;
    }
    function makeTriangles(vertices, uvs, axis, radialSegments, thetaSegments, geometry) {
        for (var i = 0; i < radialSegments; i++) {
            var startLineIndex = i * (thetaSegments + 1);
            for (var j = 0; j < thetaSegments; j++) {
                var quadIndex = startLineIndex + j;
                var v0 = quadIndex;
                var v1 = quadIndex + thetaSegments + 1;
                var v2 = quadIndex + thetaSegments + 2;
                geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [R3_1.default.copy(axis), R3_1.default.copy(axis), R3_1.default.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()]);
                v0 = quadIndex;
                v1 = quadIndex + thetaSegments + 2;
                v2 = quadIndex + 1;
                geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [R3_1.default.copy(axis), R3_1.default.copy(axis), R3_1.default.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()]);
            }
        }
    }
    function makeLineSegments(vertices, radialSegments, thetaSegments, data) {
        for (var i = 0; i < radialSegments; i++) {
            for (var j = 0; j < thetaSegments; j++) {
                var simplex = new Simplex_1.default(Simplex_1.default.LINE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j + 1, thetaSegments)];
                data.push(simplex);
                var simplex = new Simplex_1.default(Simplex_1.default.LINE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, j, thetaSegments)];
                data.push(simplex);
            }
            var simplex = new Simplex_1.default(Simplex_1.default.LINE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, thetaSegments, thetaSegments)];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, thetaSegments, thetaSegments)];
            data.push(simplex);
        }
        for (var j = 0; j < thetaSegments; j++) {
            var simplex = new Simplex_1.default(Simplex_1.default.LINE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j, thetaSegments)];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j + 1, thetaSegments)];
            data.push(simplex);
        }
    }
    function makePoints(vertices, radialSegments, thetaSegments, data) {
        for (var i = 0; i <= radialSegments; i++) {
            for (var j = 0; j <= thetaSegments; j++) {
                var simplex = new Simplex_1.default(Simplex_1.default.POINT);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
                data.push(simplex);
            }
        }
    }
    function makeEmpty(vertices, radialSegments, thetaSegments, data) {
        for (var i = 0; i <= radialSegments; i++) {
            for (var j = 0; j <= thetaSegments; j++) {
                var simplex = new Simplex_1.default(Simplex_1.default.EMPTY);
                data.push(simplex);
            }
        }
    }
    var RingSimplexGeometry = (function (_super) {
        __extends(RingSimplexGeometry, _super);
        function RingSimplexGeometry(a, b, axis, sliceStart, sliceAngle) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            _super.call(this, axis, sliceStart, sliceAngle);
            this.a = a;
            this.b = b;
        }
        RingSimplexGeometry.prototype.isModified = function () {
            return _super.prototype.isModified.call(this);
        };
        RingSimplexGeometry.prototype.regenerate = function () {
            this.data = [];
            var radialSegments = this.flatSegments;
            var thetaSegments = this.curvedSegments;
            var generator = SpinG3_1.default.dual(this.axis);
            var vertices = [];
            var uvs = [];
            computeVertices(this.a, this.b, this.axis, this.sliceStart, this.sliceAngle, generator, radialSegments, thetaSegments, vertices, uvs);
            switch (this.k) {
                case Simplex_1.default.EMPTY:
                    {
                        makeEmpty(vertices, radialSegments, thetaSegments, this.data);
                    }
                    break;
                case Simplex_1.default.POINT:
                    {
                        makePoints(vertices, radialSegments, thetaSegments, this.data);
                    }
                    break;
                case Simplex_1.default.LINE:
                    {
                        makeLineSegments(vertices, radialSegments, thetaSegments, this.data);
                    }
                    break;
                case Simplex_1.default.TRIANGLE:
                    {
                        makeTriangles(vertices, uvs, this.axis, radialSegments, thetaSegments, this);
                    }
                    break;
                default: {
                    console.warn(this.k + "-simplex is not supported for geometry generation.");
                }
            }
            this.setModified(false);
        };
        RingSimplexGeometry.prototype.setModified = function (modified) {
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        return RingSimplexGeometry;
    })(SliceSimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RingSimplexGeometry;
});
