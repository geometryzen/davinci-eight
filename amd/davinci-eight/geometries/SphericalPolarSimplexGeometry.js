var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/arc3', '../checks/mustBeNumber', '../math/R1', '../geometries/Simplex', '../geometries/SliceSimplexGeometry', '../math/SpinG3', '../math/R2', '../math/R3'], function (require, exports, arc3, mustBeNumber, R1, Simplex, SliceSimplexGeometry, SpinG3, R2, R3) {
    function computeVertices(radius, axis, phiStart, phiLength, thetaStart, thetaLength, heightSegments, widthSegments, points, uvs) {
        var generator = SpinG3.dual(axis);
        var iLength = heightSegments + 1;
        var jLength = widthSegments + 1;
        for (var i = 0; i < iLength; i++) {
            var v = i / heightSegments;
            var θ = thetaStart + v * thetaLength;
            var arcRadius = radius * Math.sin(θ);
            var begin = R3.copy(phiStart).scale(arcRadius);
            var arcPoints = arc3(begin, phiLength, generator, widthSegments);
            /**
             * Displacement that we need to add to each arc point to get the
             * distance position parallel to the axis correct.
             */
            var cosθ = Math.cos(θ);
            for (var j = 0; j < jLength; j++) {
                var u = j / widthSegments;
                var point = arcPoints[j].add(axis, cosθ);
                points.push(point);
                uvs.push(new R2([u, 1 - v]));
            }
        }
    }
    function quadIndex(i, j, innerSegments) {
        return i * (innerSegments + 1) + j;
    }
    function vertexIndex(qIndex, n, innerSegments) {
        switch (n) {
            case 0: return qIndex + 1;
            case 1: return qIndex;
            case 2: return qIndex + innerSegments + 1;
            case 3: return qIndex + innerSegments + 2;
        }
    }
    function makeTriangles(points, uvs, radius, heightSegments, widthSegments, geometry) {
        for (var i = 0; i < heightSegments; i++) {
            for (var j = 0; j < widthSegments; j++) {
                var qIndex = quadIndex(i, j, widthSegments);
                // Form a quadrilateral. v0 through v3 give the indices into the points array.
                var v0 = vertexIndex(qIndex, 0, widthSegments);
                var v1 = vertexIndex(qIndex, 1, widthSegments);
                var v2 = vertexIndex(qIndex, 2, widthSegments);
                var v3 = vertexIndex(qIndex, 3, widthSegments);
                // The normal vectors for the sphere are simply the normalized position vectors.
                var n0 = R3.copy(points[v0]).direction();
                var n1 = R3.copy(points[v1]).direction();
                var n2 = R3.copy(points[v2]).direction();
                var n3 = R3.copy(points[v3]).direction();
                // Grab the uv coordinates too.
                var uv0 = uvs[v0].clone();
                var uv1 = uvs[v1].clone();
                var uv2 = uvs[v2].clone();
                var uv3 = uvs[v3].clone();
                // Special case the north and south poles by only creating one triangle.
                // FIXME: What's the geometric equivalent here?
                if (false /*Math.abs(points[v0].y) === radius*/) {
                    uv0.x = (uv0.x + uv1.x) / 2;
                    geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
                }
                else if (false /*Math.abs(points[v2].y) === radius*/) {
                    uv2.x = (uv2.x + uv3.x) / 2;
                    geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
                }
                else {
                    // The other patches create two triangles.
                    geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3]);
                    geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1]);
                }
            }
        }
    }
    function makeLineSegments(points, uvs, radius, heightSegments, widthSegments, geometry) {
        for (var i = 0; i < heightSegments; i++) {
            for (var j = 0; j < widthSegments; j++) {
                var qIndex = quadIndex(i, j, widthSegments);
                var v0 = vertexIndex(qIndex, 0, widthSegments);
                var v1 = vertexIndex(qIndex, 1, widthSegments);
                var v2 = vertexIndex(qIndex, 2, widthSegments);
                var v3 = vertexIndex(qIndex, 3, widthSegments);
                // The normal vectors for the sphere are simply the normalized position vectors.
                var n0 = R3.copy(points[v0]).direction();
                var n1 = R3.copy(points[v1]).direction();
                var n2 = R3.copy(points[v2]).direction();
                var n3 = R3.copy(points[v3]).direction();
                // Grab the uv coordinates too.
                var uv0 = uvs[v0].clone();
                var uv1 = uvs[v1].clone();
                var uv2 = uvs[v2].clone();
                var uv3 = uvs[v3].clone();
                // Special case the north and south poles by only creating one triangle.
                // FIXME: What's the geometric equivalent here?
                if (false /*Math.abs(points[v0].y) === radius*/) {
                    uv0.x = (uv0.x + uv1.x) / 2;
                    geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
                }
                else if (false /*Math.abs(points[v2].y) === radius*/) {
                    uv2.x = (uv2.x + uv3.x) / 2;
                    geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
                }
                else {
                    geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1]);
                    geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2]);
                    geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3]);
                    geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0]);
                }
            }
        }
    }
    function makePoints(points, uvs, radius, heightSegments, widthSegments, geometry) {
        for (var i = 0; i < heightSegments; i++) {
            for (var j = 0; j < widthSegments; j++) {
                var qIndex = quadIndex(i, j, widthSegments);
                var v0 = vertexIndex(qIndex, 0, widthSegments);
                var v1 = vertexIndex(qIndex, 1, widthSegments);
                var v2 = vertexIndex(qIndex, 2, widthSegments);
                var v3 = vertexIndex(qIndex, 3, widthSegments);
                // The normal vectors for the sphere are simply the normalized position vectors.
                var n0 = R3.copy(points[v0]).direction();
                var n1 = R3.copy(points[v1]).direction();
                var n2 = R3.copy(points[v2]).direction();
                var n3 = R3.copy(points[v3]).direction();
                // Grab the uv coordinates too.
                var uv0 = uvs[v0].clone();
                var uv1 = uvs[v1].clone();
                var uv2 = uvs[v2].clone();
                var uv3 = uvs[v3].clone();
                // Special case the north and south poles by only creating one triangle.
                // FIXME: What's the geometric equivalent here?
                if (false /*Math.abs(points[v0].y) === radius*/) {
                    uv0.x = (uv0.x + uv1.x) / 2;
                    geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
                }
                else if (false /*Math.abs(points[v2].y) === radius*/) {
                    uv2.x = (uv2.x + uv3.x) / 2;
                    geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
                }
                else {
                    geometry.point([points[v0]], [n0], [uv0]);
                    geometry.point([points[v1]], [n1], [uv1]);
                    geometry.point([points[v2]], [n2], [uv2]);
                    geometry.point([points[v3]], [n3], [uv3]);
                }
            }
        }
    }
    /**
     * @class SphericalPolarSimplexGeometry
     * @extends SliceSimplexGeometry
     */
    var SphericalPolarSimplexGeometry = (function (_super) {
        __extends(SphericalPolarSimplexGeometry, _super);
        /**
         * Constructs a geometry consisting of triangular simplices based on spherical coordinates.
         * @class SphericalPolarSimplexGeometry
         * @constructor
         * @param radius [number = 1]
         * @param axis [VectorE3]
         * @param phiStart [vectorE3]
         * @param phiLength [number = 2 * Math.PI]
         * @param thetaStart [number]
         * @param thetaLength [number]
         */
        function SphericalPolarSimplexGeometry(radius, axis, phiStart, phiLength, thetaStart, thetaLength) {
            if (radius === void 0) { radius = 1; }
            if (phiLength === void 0) { phiLength = 2 * Math.PI; }
            if (thetaStart === void 0) { thetaStart = 0; }
            if (thetaLength === void 0) { thetaLength = Math.PI; }
            _super.call(this, axis, phiStart, phiLength);
            this._radius = new R1([radius]);
            this.thetaLength = thetaLength;
            this.thetaStart = thetaStart;
            this.setModified(true);
            this.regenerate();
        }
        Object.defineProperty(SphericalPolarSimplexGeometry.prototype, "radius", {
            /**
             * @property radius
             * @type {number}
             */
            get: function () {
                return this._radius.x;
            },
            set: function (radius) {
                this._radius.x = mustBeNumber('radius', radius);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphericalPolarSimplexGeometry.prototype, "phiLength", {
            /**
             * @property phiLength
             * @type {number}
             */
            get: function () {
                return this.sliceAngle;
            },
            set: function (phiLength) {
                this.sliceAngle = phiLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphericalPolarSimplexGeometry.prototype, "phiStart", {
            /**
             * Defines a start half-plane relative to the <code>axis</code> property.
             * @property phiStart
             * @type {R3}
             */
            get: function () {
                return this.sliceStart;
            },
            set: function (phiStart) {
                this.sliceStart.copy(phiStart);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setAxis
         * @param axis {VectorE3}
         * @return {SphericalPolarSimplexGeometry}
         * @chainable
         */
        SphericalPolarSimplexGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {SphericalPolarSimplexGeometry}
         * @chainable
         */
        SphericalPolarSimplexGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        SphericalPolarSimplexGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        /**
         * @method isModified
         * @return {boolean}
         */
        SphericalPolarSimplexGeometry.prototype.isModified = function () {
            return this._radius.modified || _super.prototype.isModified.call(this);
        };
        /**
         * @method setModified
         * @param modified {boolean}
         * @return {SphericalPolarSimplexGeometry}
         * @chainable
         */
        SphericalPolarSimplexGeometry.prototype.setModified = function (modified) {
            _super.prototype.setModified.call(this, modified);
            this._radius.modified = modified;
            return this;
        };
        /**
         * @method regenerate
         * @return {void}
         */
        SphericalPolarSimplexGeometry.prototype.regenerate = function () {
            this.data = [];
            var heightSegments = this.curvedSegments;
            var widthSegments = this.curvedSegments;
            // Output. Could this be {[name:string]:VertexN<number>}[]
            var points = [];
            var uvs = [];
            computeVertices(this.radius, this.axis, this.phiStart, this.phiLength, this.thetaStart, this.thetaLength, heightSegments, widthSegments, points, uvs);
            switch (this.k) {
                case Simplex.EMPTY:
                    {
                        makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                case Simplex.POINT:
                    {
                        makePoints(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                case Simplex.LINE:
                    {
                        makeLineSegments(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                case Simplex.TRIANGLE:
                    {
                        makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this);
                    }
                    break;
                default: {
                    console.warn(this.k + "-simplex is not supported for geometry generation.");
                }
            }
            this.setModified(false);
        };
        return SphericalPolarSimplexGeometry;
    })(SliceSimplexGeometry);
    return SphericalPolarSimplexGeometry;
});
