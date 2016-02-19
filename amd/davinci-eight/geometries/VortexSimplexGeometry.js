var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/G3', '../geometries/SimplexPrimitivesBuilder', '../checks/mustBeInteger', '../math/Spinor3', '../math/Vector2', '../math/Vector3'], function (require, exports, G3_1, SimplexPrimitivesBuilder_1, mustBeInteger_1, Spinor3_1, Vector2_1, Vector3_1) {
    function perpendicular(to) {
        var random = new Vector3_1.default([Math.random(), Math.random(), Math.random()]);
        random.cross(to).direction();
        return new G3_1.default(0, random.x, random.y, random.z, 0, 0, 0, 0);
    }
    var VortexSimplexGeometry = (function (_super) {
        __extends(VortexSimplexGeometry, _super);
        function VortexSimplexGeometry() {
            _super.call(this);
            this.radius = 1;
            this.radiusCone = 0.08;
            this.radiusShaft = 0.01;
            this.lengthCone = 0.2;
            this.lengthShaft = 0.8;
            this.arrowSegments = 8;
            this.radialSegments = 12;
            this.generator = Spinor3_1.default.dual(G3_1.default.e3);
            this.setModified(true);
        }
        VortexSimplexGeometry.prototype.isModified = function () {
            return this.generator.modified;
        };
        VortexSimplexGeometry.prototype.setModified = function (modified) {
            this.generator.modified = modified;
            return this;
        };
        VortexSimplexGeometry.prototype.regenerate = function () {
            this.data = [];
            var radiusCone = this.radiusCone;
            var radiusShaft = this.radiusShaft;
            var radialSegments = this.radialSegments;
            var axis = new G3_1.default(0, -this.generator.yz, -this.generator.zx, -this.generator.xy, 0, 0, 0, 0);
            var radial = perpendicular(axis);
            var R0 = radial.scale(this.radius);
            var generator = new G3_1.default(this.generator.α, 0, 0, 0, this.generator.xy, this.generator.yz, this.generator.zx, 0);
            var Rminor0 = axis.ext(radial);
            var n = 9;
            var circleSegments = this.arrowSegments * n;
            var tau = Math.PI * 2;
            var center = new Vector3_1.default([0, 0, 0]);
            var normals = [];
            var points = [];
            var uvs = [];
            var alpha = this.lengthShaft / (this.lengthCone + this.lengthShaft);
            var factor = tau / this.arrowSegments;
            var theta = alpha / (n - 2);
            function computeAngle(index) {
                mustBeInteger_1.default('index', index);
                var m = index % n;
                if (m === n - 1) {
                    return computeAngle(index - 1);
                }
                else {
                    var a = (index - m) / n;
                    return factor * (a + m * theta);
                }
            }
            function computeRadius(index) {
                mustBeInteger_1.default('index', index);
                var m = index % n;
                if (m === n - 1) {
                    return radiusCone;
                }
                else {
                    return radiusShaft;
                }
            }
            for (var j = 0; j <= radialSegments; j++) {
                var v = tau * j / radialSegments;
                for (var i = 0; i <= circleSegments; i++) {
                    var u = computeAngle(i);
                    var Rmajor = generator.scale(-u / 2).exp();
                    center.copy(R0).rotate(Rmajor);
                    var vertex = Vector3_1.default.copy(center);
                    var r0 = axis.scale(computeRadius(i));
                    var Rminor = Rmajor.mul(Rminor0).mul(Rmajor.__tilde__()).scale(-v / 2).exp();
                    var r = Rminor.mul(r0).mul(Rminor.__tilde__());
                    vertex.add2(center, r);
                    points.push(vertex);
                    uvs.push(new Vector2_1.default([i / circleSegments, j / radialSegments]));
                    normals.push(Vector3_1.default.copy(r).direction());
                }
            }
            for (var j = 1; j <= radialSegments; j++) {
                for (var i = 1; i <= circleSegments; i++) {
                    var a = (circleSegments + 1) * j + i - 1;
                    var b = (circleSegments + 1) * (j - 1) + i - 1;
                    var c = (circleSegments + 1) * (j - 1) + i;
                    var d = (circleSegments + 1) * j + i;
                    this.triangle([points[a], points[b], points[d]], [normals[a], normals[b], normals[d]], [uvs[a], uvs[b], uvs[d]]);
                    this.triangle([points[b], points[c], points[d]], [normals[b], normals[c], normals[d]], [uvs[b], uvs[c], uvs[d]]);
                }
            }
            this.setModified(false);
        };
        return VortexSimplexGeometry;
    })(SimplexPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VortexSimplexGeometry;
});
