"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var SliceSimplexPrimitivesBuilder_1 = require("../geometries/SliceSimplexPrimitivesBuilder");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
var ConeSimplexGeometry = /** @class */ (function (_super) {
    tslib_1.__extends(ConeSimplexGeometry, _super);
    function ConeSimplexGeometry(radius, height, axis, radiusTop, openCap, openBase, thetaStart) {
        if (radius === void 0) { radius = 0.5; }
        if (height === void 0) { height = 1; }
        if (radiusTop === void 0) { radiusTop = 0.0; }
        if (openCap === void 0) { openCap = false; }
        if (openBase === void 0) { openBase = false; }
        if (thetaStart === void 0) { thetaStart = 0; }
        var _this = _super.call(this) || this;
        _this.radiusTop = radiusTop;
        _this.radius = radius;
        _this.height = height;
        _this.openCap = openCap;
        _this.openBase = openBase;
        _this.thetaStart = thetaStart;
        return _this;
    }
    ConeSimplexGeometry.prototype.regenerate = function () {
        var radiusBottom = this.radius;
        var radiusTop = this.radiusTop;
        var height = this.height;
        var heightSegments = this.flatSegments;
        var radialSegments = this.curvedSegments;
        var openCap = this.openCap;
        var openBase = this.openBase;
        var thetaStart = this.thetaStart;
        var sliceAngle = this.sliceAngle;
        var heightHalf = height / 2;
        var x;
        var y;
        var points = [];
        var vertices = [];
        var uvs = [];
        for (y = 0; y <= heightSegments; y++) {
            var verticesRow = [];
            var uvsRow = [];
            var v = y / heightSegments;
            var radius = v * (radiusBottom - radiusTop) + radiusTop;
            for (x = 0; x <= radialSegments; x++) {
                var u = x / radialSegments;
                var vertex = new Vector3_1.Vector3();
                vertex.x = radius * Math.sin(u * sliceAngle + thetaStart);
                vertex.y = -v * height + heightHalf;
                vertex.z = radius * Math.cos(u * sliceAngle + thetaStart);
                points.push(vertex);
                verticesRow.push(points.length - 1);
                uvsRow.push(new Vector2_1.Vector2([u, 1 - v]));
            }
            vertices.push(verticesRow);
            uvs.push(uvsRow);
        }
        var tanTheta = (radiusBottom - radiusTop) / height;
        var na;
        var nb;
        for (x = 0; x < radialSegments; x++) {
            if (radiusTop !== 0) {
                na = Vector3_1.Vector3.copy(points[vertices[0][x]]);
                nb = Vector3_1.Vector3.copy(points[vertices[0][x + 1]]);
            }
            else {
                na = Vector3_1.Vector3.copy(points[vertices[1][x]]);
                nb = Vector3_1.Vector3.copy(points[vertices[1][x + 1]]);
            }
            na.y = Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta;
            na.normalize();
            nb.y = Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta;
            nb.normalize();
            for (y = 0; y < heightSegments; y++) {
                var v1 = vertices[y][x];
                var v2 = vertices[y + 1][x];
                var v3 = vertices[y + 1][x + 1];
                var v4 = vertices[y][x + 1];
                var n1 = na.clone();
                var n2 = na.clone();
                var n3 = nb.clone();
                var n4 = nb.clone();
                var uv1 = uvs[y][x].clone();
                var uv2 = uvs[y + 1][x].clone();
                var uv3 = uvs[y + 1][x + 1].clone();
                var uv4 = uvs[y][x + 1].clone();
                this.triangle([points[v1], points[v2], points[v4]], [n1, n2, n4], [uv1, uv2, uv4]);
                this.triangle([points[v2], points[v3], points[v4]], [n2.clone(), n3, n4.clone()], [uv2.clone(), uv3, uv4.clone()]);
            }
        }
        // top cap
        if (!openCap && radiusTop > 0) {
            points.push(Vector3_1.Vector3.vector(0, 1, 0).scale(heightHalf));
            for (x = 0; x < radialSegments; x++) {
                var v1 = vertices[0][x];
                var v2 = vertices[0][x + 1];
                var v3 = points.length - 1;
                var n1 = Vector3_1.Vector3.vector(0, 1, 0);
                var n2 = Vector3_1.Vector3.vector(0, 1, 0);
                var n3 = Vector3_1.Vector3.vector(0, 1, 0);
                var uv1 = uvs[0][x].clone();
                var uv2 = uvs[0][x + 1].clone();
                var uv3 = new Vector2_1.Vector2([uv2.x, 0]);
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
            }
        }
        // bottom cap
        if (!openBase && radiusBottom > 0) {
            points.push(Vector3_1.Vector3.vector(0, 1, 0).scale(-heightHalf));
            for (x = 0; x < radialSegments; x++) {
                var v1 = vertices[heightSegments][x + 1];
                var v2 = vertices[heightSegments][x];
                var v3 = points.length - 1;
                var n1 = Vector3_1.Vector3.vector(0, -1, 0);
                var n2 = Vector3_1.Vector3.vector(0, -1, 0);
                var n3 = Vector3_1.Vector3.vector(0, -1, 0);
                var uv1 = uvs[heightSegments][x + 1].clone();
                var uv2 = uvs[heightSegments][x].clone();
                var uv3 = new Vector2_1.Vector2([uv2.x, 1]);
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
            }
        }
        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    };
    return ConeSimplexGeometry;
}(SliceSimplexPrimitivesBuilder_1.SliceSimplexPrimitivesBuilder));
exports.ConeSimplexGeometry = ConeSimplexGeometry;
