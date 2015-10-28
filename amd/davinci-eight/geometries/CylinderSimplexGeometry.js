var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/arc3', '../geometries/SliceSimplexGeometry', '../math/SpinG3', '../math/R2', '../math/R3'], function (require, exports, arc3, SliceSimplexGeometry, SpinG3, R2, R3) {
    // TODO: The caps don't have radial segments!
    function computeVertices(radius, height, axis, start, angle, generator, heightSegments, thetaSegments, points, vertices, uvs) {
        var begin = R3.copy(start).scale(radius);
        var halfHeight = R3.copy(axis).scale(0.5 * height);
        /**
         * A displacement in the direction of axis that we must move for each height step.
         */
        var stepH = R3.copy(axis).normalize().scale(height / heightSegments);
        for (var i = 0; i <= heightSegments; i++) {
            /**
             * The displacement to the current level.
             */
            var dispH = R3.copy(stepH).scale(i).sub(halfHeight);
            var verticesRow = [];
            var uvsRow = [];
            /**
             * Interesting that the v coordinate is 1 at the base and 0 at the top!
             * This is because i originally went from top to bottom.
             */
            var v = (heightSegments - i) / heightSegments;
            /**
             * arcPoints.length => thetaSegments + 1
             */
            var arcPoints = arc3(begin, angle, generator, thetaSegments);
            /**
             * j < arcPoints.length => j <= thetaSegments
             */
            for (var j = 0, jLength = arcPoints.length; j < jLength; j++) {
                var point = arcPoints[j].add(dispH);
                /**
                 * u will vary from 0 to 1, because j goes from 0 to thetaSegments
                 */
                var u = j / thetaSegments;
                points.push(point);
                verticesRow.push(points.length - 1);
                uvsRow.push(new R2([u, v]));
            }
            vertices.push(verticesRow);
            uvs.push(uvsRow);
        }
    }
    /**
     * @class CylinderSimplexGeometry
     * @extends SliceSimplexGeometry
     */
    var CylinderSimplexGeometry = (function (_super) {
        __extends(CylinderSimplexGeometry, _super);
        /**
         * <p>
         * Constructs a Cylindrical Shell.
         * </p>
         * <p>
         * Sets the <code>sliceAngle</code> property to <code>2 * Math.PI</p>.
         * </p>
         * @class CylinderSimplexGeometry
         * @constructor
         * @param radius [number = 1]
         * @param height [number = 1]
         * @param axis [VectorE3 = R3.e2]
         * @param openTop [boolean = false]
         * @param openBottom [boolean = false]
         */
        function CylinderSimplexGeometry(radius, height, axis, openTop, openBottom) {
            if (radius === void 0) { radius = 1; }
            if (height === void 0) { height = 1; }
            if (axis === void 0) { axis = R3.e2; }
            if (openTop === void 0) { openTop = false; }
            if (openBottom === void 0) { openBottom = false; }
            _super.call(this, 'CylinderSimplexGeometry', axis, void 0, void 0);
            this.radius = radius;
            this.height = height;
            this.openTop = openTop;
            this.openBottom = openBottom;
            this.setModified(true);
        }
        CylinderSimplexGeometry.prototype.regenerate = function () {
            this.data = [];
            var radius = this.radius;
            //let height = this.height
            var heightSegments = this.flatSegments;
            var thetaSegments = this.curvedSegments;
            var generator = SpinG3.dual(this.axis);
            var heightHalf = this.height / 2;
            var points = [];
            // The double array allows us to manage the i,j indexing more naturally.
            // The alternative is to use an indexing function.
            var vertices = [];
            var uvs = [];
            computeVertices(radius, this.height, this.axis, this.sliceStart, this.sliceAngle, generator, heightSegments, thetaSegments, points, vertices, uvs);
            var na;
            var nb;
            // sides
            for (var j = 0; j < thetaSegments; j++) {
                if (radius !== 0) {
                    na = R3.copy(points[vertices[0][j]]);
                    nb = R3.copy(points[vertices[0][j + 1]]);
                }
                else {
                    na = R3.copy(points[vertices[1][j]]);
                    nb = R3.copy(points[vertices[1][j + 1]]);
                }
                // FIXME: This isn't geometric.
                na.setY(0).normalize();
                nb.setY(0).normalize();
                for (var i = 0; i < heightSegments; i++) {
                    /**
                     *  2-------3
                     *  |       |
                     *  |       |
                     *  |       |
                     *  1-------4
                     */
                    var v1 = vertices[i][j];
                    var v2 = vertices[i + 1][j];
                    var v3 = vertices[i + 1][j + 1];
                    var v4 = vertices[i][j + 1];
                    // The normals for 1 and 2 are the same.
                    // The normals for 3 and 4 are the same.
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
            // top cap
            if (!this.openTop && radius > 0) {
                // Push an extra point for the center of the top.
                points.push(this.axis.clone().scale(heightHalf));
                for (var j = 0; j < thetaSegments; j++) {
                    var v1 = vertices[heightSegments][j + 1];
                    var v2 = points.length - 1;
                    var v3 = vertices[heightSegments][j];
                    var n1 = this.axis.clone();
                    var n2 = this.axis.clone();
                    var n3 = this.axis.clone();
                    var uv1 = uvs[heightSegments][j + 1].clone();
                    // Check this
                    var uv2 = new R2([uv1.x, 1]);
                    var uv3 = uvs[heightSegments][j].clone();
                    this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
                }
            }
            // bottom cap
            if (!this.openBottom && radius > 0) {
                // Push an extra point for the center of the bottom.
                points.push(this.axis.clone().scale(-heightHalf));
                for (var j = 0; j < thetaSegments; j++) {
                    var v1 = vertices[0][j];
                    var v2 = points.length - 1;
                    var v3 = vertices[0][j + 1];
                    var n1 = this.axis.clone().scale(-1);
                    var n2 = this.axis.clone().scale(-1);
                    var n3 = this.axis.clone().scale(-1);
                    var uv1 = uvs[0][j].clone();
                    // TODO: Check this
                    var uv2 = new R2([uv1.x, 1]);
                    var uv3 = uvs[0][j + 1].clone();
                    this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
                }
            }
            //    this.computeFaceNormals();
            //    this.computeVertexNormals();
            this.setModified(false);
        };
        return CylinderSimplexGeometry;
    })(SliceSimplexGeometry);
    return CylinderSimplexGeometry;
});
