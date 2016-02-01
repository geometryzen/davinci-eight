var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/SimplexGeometry', '../math/SpinG3', '../math/R2'], function (require, exports, SimplexGeometry_1, SpinG3_1, R2_1) {
    var RevolutionSimplexGeometry = (function (_super) {
        __extends(RevolutionSimplexGeometry, _super);
        function RevolutionSimplexGeometry() {
            _super.call(this);
        }
        RevolutionSimplexGeometry.prototype.revolve = function (points, generator, segments, phiStart, phiLength, attitude) {
            if (segments === void 0) { segments = 12; }
            if (phiStart === void 0) { phiStart = 0; }
            if (phiLength === void 0) { phiLength = 2 * Math.PI; }
            var vertices = [];
            var isClosed = Math.abs(2 * Math.PI - Math.abs(phiLength - phiStart)) < 0.0001;
            var halfPlanes = isClosed ? segments : segments + 1;
            var inverseSegments = 1.0 / segments;
            var phiStep = (phiLength - phiStart) * inverseSegments;
            var i;
            var j;
            var il;
            var jl;
            var R = new SpinG3_1.default();
            for (i = 0, il = halfPlanes; i < il; i++) {
                var φ = phiStart + i * phiStep;
                R.rotorFromGeneratorAngle(generator, φ);
                for (j = 0, jl = points.length; j < jl; j++) {
                    var vertex = points[j].clone();
                    vertex.rotate(R);
                    if (attitude) {
                        vertex.rotate(attitude);
                    }
                    vertices.push(vertex);
                }
            }
            var inversePointLength = 1.0 / (points.length - 1);
            var np = points.length;
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
                    this.triangle([vertices[d], vertices[b], vertices[a]], [], [new R2_1.default([u0, v0]), new R2_1.default([u1, v0]), new R2_1.default([u0, v1])]);
                    this.triangle([vertices[d], vertices[c], vertices[b]], [], [new R2_1.default([u1, v0]), new R2_1.default([u1, v1]), new R2_1.default([u0, v1])]);
                }
            }
        };
        return RevolutionSimplexGeometry;
    })(SimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RevolutionSimplexGeometry;
});
