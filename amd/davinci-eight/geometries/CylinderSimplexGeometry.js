var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/arc3', '../geometries/SliceSimplexGeometry', '../math/SpinG3', '../math/R2', '../math/R3'], function (require, exports, arc3_1, SliceSimplexGeometry_1, SpinG3_1, R2_1, R3_1) {
    function computeVertices(radius, height, axis, start, angle, generator, heightSegments, thetaSegments, points, vertices, uvs) {
        var begin = R3_1.default.copy(start).scale(radius);
        var halfHeight = R3_1.default.copy(axis).scale(0.5 * height);
        var stepH = R3_1.default.copy(axis).direction().scale(height / heightSegments);
        for (var i = 0; i <= heightSegments; i++) {
            var dispH = R3_1.default.copy(stepH).scale(i).sub(halfHeight);
            var verticesRow = [];
            var uvsRow = [];
            var v = (heightSegments - i) / heightSegments;
            var arcPoints = arc3_1.default(begin, angle, generator, thetaSegments);
            for (var j = 0, jLength = arcPoints.length; j < jLength; j++) {
                var point = arcPoints[j].add(dispH);
                var u = j / thetaSegments;
                points.push(point);
                verticesRow.push(points.length - 1);
                uvsRow.push(new R2_1.default([u, v]));
            }
            vertices.push(verticesRow);
            uvs.push(uvsRow);
        }
    }
    var CylinderSimplexGeometry = (function (_super) {
        __extends(CylinderSimplexGeometry, _super);
        function CylinderSimplexGeometry(radius, height, axis, openTop, openBottom) {
            if (radius === void 0) { radius = 1; }
            if (height === void 0) { height = 1; }
            if (axis === void 0) { axis = R3_1.default.e2; }
            if (openTop === void 0) { openTop = false; }
            if (openBottom === void 0) { openBottom = false; }
            _super.call(this, axis, void 0, void 0);
            this.radius = radius;
            this.height = height;
            this.openTop = openTop;
            this.openBottom = openBottom;
            this.setModified(true);
        }
        CylinderSimplexGeometry.prototype.regenerate = function () {
            this.data = [];
            var radius = this.radius;
            var heightSegments = this.flatSegments;
            var thetaSegments = this.curvedSegments;
            var generator = SpinG3_1.default.dual(this.axis);
            var heightHalf = this.height / 2;
            var points = [];
            var vertices = [];
            var uvs = [];
            computeVertices(radius, this.height, this.axis, this.sliceStart, this.sliceAngle, generator, heightSegments, thetaSegments, points, vertices, uvs);
            var na;
            var nb;
            for (var j = 0; j < thetaSegments; j++) {
                if (radius !== 0) {
                    na = R3_1.default.copy(points[vertices[0][j]]);
                    nb = R3_1.default.copy(points[vertices[0][j + 1]]);
                }
                else {
                    na = R3_1.default.copy(points[vertices[1][j]]);
                    nb = R3_1.default.copy(points[vertices[1][j + 1]]);
                }
                na.setY(0).direction();
                nb.setY(0).direction();
                for (var i = 0; i < heightSegments; i++) {
                    var v1 = vertices[i][j];
                    var v2 = vertices[i + 1][j];
                    var v3 = vertices[i + 1][j + 1];
                    var v4 = vertices[i][j + 1];
                    var n1 = na.clone();
                    var n2 = na.clone();
                    var n3 = nb.clone();
                    var n4 = nb.clone();
                    var uv1 = uvs[i][j].clone();
                    var uv2 = uvs[i + 1][j].clone();
                    var uv3 = uvs[i + 1][j + 1].clone();
                    var uv4 = uvs[i][j + 1].clone();
                    this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3]);
                    this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()]);
                }
            }
            if (!this.openTop && radius > 0) {
                points.push(R3_1.default.copy(this.axis).scale(heightHalf));
                for (var j = 0; j < thetaSegments; j++) {
                    var v1 = vertices[heightSegments][j + 1];
                    var v2 = points.length - 1;
                    var v3 = vertices[heightSegments][j];
                    var n1 = R3_1.default.copy(this.axis);
                    var n2 = R3_1.default.copy(this.axis);
                    var n3 = R3_1.default.copy(this.axis);
                    var uv1 = uvs[heightSegments][j + 1].clone();
                    var uv2 = new R2_1.default([uv1.x, 1]);
                    var uv3 = uvs[heightSegments][j].clone();
                    this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
                }
            }
            if (!this.openBottom && radius > 0) {
                points.push(R3_1.default.copy(this.axis).scale(-heightHalf));
                for (var j = 0; j < thetaSegments; j++) {
                    var v1 = vertices[0][j];
                    var v2 = points.length - 1;
                    var v3 = vertices[0][j + 1];
                    var n1 = R3_1.default.copy(this.axis).scale(-1);
                    var n2 = R3_1.default.copy(this.axis).scale(-1);
                    var n3 = R3_1.default.copy(this.axis).scale(-1);
                    var uv1 = uvs[0][j].clone();
                    var uv2 = new R2_1.default([uv1.x, 1]);
                    var uv3 = uvs[0][j + 1].clone();
                    this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
                }
            }
            this.setModified(false);
        };
        return CylinderSimplexGeometry;
    })(SliceSimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CylinderSimplexGeometry;
});
