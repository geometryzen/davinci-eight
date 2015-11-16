var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../geometries/SliceSimplexGeometry', '../math/R2', '../math/R3'], function (require, exports, Euclidean3, SliceSimplexGeometry, R2, R3) {
    /**
     * @class ConeSimplexGeometry
     * @extends SliceSimplexGeometry
     */
    var ConeSimplexGeometry = (function (_super) {
        __extends(ConeSimplexGeometry, _super);
        /**
         * @class ConeSimplexGeometry
         * @constructor
         * @param [radiusTop = 0.5] {number}
         * @param [radius = 0.5] {number}
         * @param [height = 1] {number}
         * @param [openTop = false] {boolean}
         * @param [openBottom = false] {boolean}
         * @param [thetaStart = 0] {number}
         */
        function ConeSimplexGeometry(radius, height, axis, radiusTop, openTop, openBottom, thetaStart) {
            if (radius === void 0) { radius = 0.5; }
            if (height === void 0) { height = 1; }
            if (radiusTop === void 0) { radiusTop = 0.0; }
            if (openTop === void 0) { openTop = false; }
            if (openBottom === void 0) { openBottom = false; }
            if (thetaStart === void 0) { thetaStart = 0; }
            _super.call(this, axis, void 0, void 0);
            this.radiusTop = radiusTop;
            this.radius = radius;
            this.height = height;
            this.openTop = openTop;
            this.openBottom = openBottom;
            this.thetaStart = thetaStart;
        }
        ConeSimplexGeometry.prototype.regenerate = function () {
            var radiusBottom = this.radius;
            var radiusTop = this.radiusTop;
            var height = this.height;
            var heightSegments = this.flatSegments;
            var radialSegments = this.curvedSegments;
            var openTop = this.openTop;
            var openBottom = this.openBottom;
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
                    var vertex = new R3();
                    vertex.x = radius * Math.sin(u * sliceAngle + thetaStart);
                    vertex.y = -v * height + heightHalf;
                    vertex.z = radius * Math.cos(u * sliceAngle + thetaStart);
                    points.push(vertex);
                    verticesRow.push(points.length - 1);
                    uvsRow.push(new R2([u, 1 - v]));
                }
                vertices.push(verticesRow);
                uvs.push(uvsRow);
            }
            var tanTheta = (radiusBottom - radiusTop) / height;
            var na;
            var nb;
            for (x = 0; x < radialSegments; x++) {
                if (radiusTop !== 0) {
                    na = R3.copy(points[vertices[0][x]]);
                    nb = R3.copy(points[vertices[0][x + 1]]);
                }
                else {
                    na = R3.copy(points[vertices[1][x]]);
                    nb = R3.copy(points[vertices[1][x + 1]]);
                }
                na.setY(Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta).direction();
                nb.setY(Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta).direction();
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
            if (!openTop && radiusTop > 0) {
                points.push(R3.copy(Euclidean3.e2).scale(heightHalf));
                for (x = 0; x < radialSegments; x++) {
                    var v1 = vertices[0][x];
                    var v2 = vertices[0][x + 1];
                    var v3 = points.length - 1;
                    var n1 = R3.copy(Euclidean3.e2);
                    var n2 = R3.copy(Euclidean3.e2);
                    var n3 = R3.copy(Euclidean3.e2);
                    var uv1 = uvs[0][x].clone();
                    var uv2 = uvs[0][x + 1].clone();
                    var uv3 = new R2([uv2.x, 0]);
                    this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
                }
            }
            // bottom cap
            if (!openBottom && radiusBottom > 0) {
                points.push(R3.copy(Euclidean3.e2).scale(-heightHalf));
                for (x = 0; x < radialSegments; x++) {
                    var v1 = vertices[heightSegments][x + 1];
                    var v2 = vertices[heightSegments][x];
                    var v3 = points.length - 1;
                    var n1 = R3.copy(Euclidean3.e2).scale(-1);
                    var n2 = R3.copy(Euclidean3.e2).scale(-1);
                    var n3 = R3.copy(Euclidean3.e2).scale(-1);
                    var uv1 = uvs[heightSegments][x + 1].clone();
                    var uv2 = uvs[heightSegments][x].clone();
                    var uv3 = new R2([uv2.x, 1]);
                    this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
                }
            }
            //    this.computeFaceNormals();
            //    this.computeVertexNormals();
        };
        return ConeSimplexGeometry;
    })(SliceSimplexGeometry);
    return ConeSimplexGeometry;
});
