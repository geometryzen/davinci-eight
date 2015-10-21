var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/SimplexGeometry', '../math/MutableSpinorE3', '../math/MutableVectorE2'], function (require, exports, SimplexGeometry, MutableSpinorE3, MutableVectorE2) {
    /**
     * @class RevolutionSimplexGeometry
     */
    var RevolutionSimplexGeometry = (function (_super) {
        __extends(RevolutionSimplexGeometry, _super);
        /**
         * @class RevolutionSimplexGeometry
         * @constructor
         */
        function RevolutionSimplexGeometry(type) {
            if (type === void 0) { type = 'RevolutionSimplexGeometry'; }
            _super.call(this, type);
        }
        /**
         * @method revolve
         * @param points {MutableVectorE3[]}
         * @param generator {MutableSpinorE3}
         * @param segments {number}
         * @param phiStart {number}
         * @param phiLength {number}
         * @param attitude {MutableSpinorE3}
         */
        RevolutionSimplexGeometry.prototype.revolve = function (points, generator, segments, phiStart, phiLength, attitude) {
            if (segments === void 0) { segments = 12; }
            if (phiStart === void 0) { phiStart = 0; }
            if (phiLength === void 0) { phiLength = 2 * Math.PI; }
            /**
             * Temporary list of points.
             */
            var vertices = [];
            // Determine heuristically whether the user intended to make a complete revolution.
            var isClosed = Math.abs(2 * Math.PI - Math.abs(phiLength - phiStart)) < 0.0001;
            // The number of vertical half planes (phi constant).
            var halfPlanes = isClosed ? segments : segments + 1;
            var inverseSegments = 1.0 / segments;
            var phiStep = (phiLength - phiStart) * inverseSegments;
            var i;
            var j;
            var il;
            var jl;
            var rotor = new MutableSpinorE3();
            for (i = 0, il = halfPlanes; i < il; i++) {
                var phi = phiStart + i * phiStep;
                var halfAngle = phi / 2;
                //var cosHA = Math.cos( halfAngle );
                //var sinHA = Math.sin( halfAngle );
                rotor.copy(generator).scale(halfAngle).exp();
                // TODO: This is simply the exp(B theta / 2), maybe needs a sign.
                //var rotor = new MutableSpinorE3([generator.yz * sinHA, generator.zx * sinHA, generator.xy * sinHA, cosHA]);
                for (j = 0, jl = points.length; j < jl; j++) {
                    var vertex = points[j].clone();
                    // The generator tells us how to rotate the points.
                    vertex.rotate(rotor);
                    // The attitude tells us where we want the symmetry axis to be.
                    if (attitude) {
                        vertex.rotate(attitude);
                    }
                    vertices.push(vertex);
                }
            }
            var inversePointLength = 1.0 / (points.length - 1);
            var np = points.length;
            // The denominator for modulo index arithmetic.
            var wrap = np * halfPlanes;
            for (i = 0, il = segments; i < il; i++) {
                for (j = 0, jl = points.length - 1; j < jl; j++) {
                    var base = j + np * i;
                    var a = base % wrap;
                    var b = (base + np) % wrap;
                    var c = (base + 1 + np) % wrap;
                    var d = (base + 1) % wrap;
                    var u0 = i * inverseSegments;
                    var v0 = j * inversePointLength;
                    var u1 = u0 + inverseSegments;
                    var v1 = v0 + inversePointLength;
                    this.triangle([vertices[d], vertices[b], vertices[a]], [], [new MutableVectorE2([u0, v0]), new MutableVectorE2([u1, v0]), new MutableVectorE2([u0, v1])]);
                    this.triangle([vertices[d], vertices[c], vertices[b]], [], [new MutableVectorE2([u1, v0]), new MutableVectorE2([u1, v1]), new MutableVectorE2([u0, v1])]);
                }
            }
            //    this.computeFaceNormals();
            //    this.computeVertexNormals();
        };
        return RevolutionSimplexGeometry;
    })(SimplexGeometry);
    return RevolutionSimplexGeometry;
});
