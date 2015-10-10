var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../geometries/Geometry', '../checks/mustBeInteger', '../checks/mustBeString', '../geometries/Simplex', '../math/Spinor3', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, Euclidean3, Geometry, mustBeInteger, mustBeString, Simplex, Spinor3, Symbolic, Vector2, Vector3) {
    function perpendicular(to) {
        var random = new Vector3([Math.random(), Math.random(), Math.random()]);
        random.cross(to).normalize();
        return new Euclidean3(0, random.x, random.y, random.z, 0, 0, 0, 0);
    }
    /**
     * @class VortexGeometry
     */
    var VortexGeometry = (function (_super) {
        __extends(VortexGeometry, _super);
        /**
         * @class VortexGeometry
         * @constructor
         * @param type [string = 'VortexGeometry']
         */
        function VortexGeometry(type) {
            if (type === void 0) { type = 'VortexGeometry'; }
            _super.call(this, mustBeString('type', type));
            this.radius = 1;
            this.radiusCone = 0.08;
            this.radiusShaft = 0.01;
            this.lengthCone = 0.2;
            this.lengthShaft = 0.8;
            this.arrowSegments = 8;
            this.radialSegments = 12;
            this.generator = new Spinor3([0, 0, 1, 0]);
            this.setModified(true);
        }
        VortexGeometry.prototype.isModified = function () {
            return this.generator.modified;
        };
        /**
         * @method setModified
         * @param modified {boolean}
         * @return {ArrowGeometry}
         */
        VortexGeometry.prototype.setModified = function (modified) {
            this.generator.modified = modified;
            return this;
        };
        /**
         * @method recalculate
         * @return {void}
         */
        VortexGeometry.prototype.recalculate = function () {
            this.data = [];
            var radius = this.radius;
            var radiusCone = this.radiusCone;
            var radiusShaft = this.radiusShaft;
            var radialSegments = this.radialSegments;
            var axis = new Euclidean3(0, -this.generator.yz, -this.generator.zx, -this.generator.xy, 0, 0, 0, 0);
            var radial = perpendicular(axis);
            // FIXME: Change to scale
            var R0 = radial.scalarMultiply(this.radius);
            var generator = new Euclidean3(this.generator.w, 0, 0, 0, this.generator.xy, this.generator.yz, this.generator.zx, 0);
            var Rminor0 = axis.wedge(radial);
            var n = 9;
            var circleSegments = this.arrowSegments * n;
            var tau = Math.PI * 2;
            var center = new Vector3([0, 0, 0]);
            var normals = [];
            var points = [];
            var uvs = [];
            var alpha = this.lengthShaft / (this.lengthCone + this.lengthShaft);
            var factor = tau / this.arrowSegments;
            var theta = alpha / (n - 2);
            function computeAngle(index) {
                mustBeInteger('index', index);
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
                mustBeInteger('index', index);
                var m = index % n;
                if (m === n - 1) {
                    return radiusCone;
                }
                else {
                    return radiusShaft;
                }
            }
            for (var j = 0; j <= radialSegments; j++) {
                // v is the angle inside the vortex tube.
                var v = tau * j / radialSegments;
                for (var i = 0; i <= circleSegments; i++) {
                    // u is the angle in the xy-plane measured from the x-axis clockwise about the z-axis.
                    var u = computeAngle(i);
                    var Rmajor = generator.scalarMultiply(-u / 2).exp();
                    center.copy(R0).rotate(Rmajor);
                    var vertex = Vector3.copy(center);
                    var r0 = axis.scalarMultiply(computeRadius(i));
                    var Rminor = Rmajor.mul(Rminor0).mul(Rmajor.__tilde__()).scalarMultiply(-v / 2).exp();
                    // var Rminor = Rminor0.clone().rotate(Rmajor).scale(-v/2).exp()
                    var r = Rminor.mul(r0).mul(Rminor.__tilde__());
                    vertex.sum(center, r);
                    points.push(vertex);
                    uvs.push(new Vector2([i / circleSegments, j / radialSegments]));
                    normals.push(Vector3.copy(r).normalize());
                }
            }
            for (var j = 1; j <= radialSegments; j++) {
                for (var i = 1; i <= circleSegments; i++) {
                    var a = (circleSegments + 1) * j + i - 1;
                    var b = (circleSegments + 1) * (j - 1) + i - 1;
                    var c = (circleSegments + 1) * (j - 1) + i;
                    var d = (circleSegments + 1) * j + i;
                    var face = new Simplex(Simplex.K_FOR_TRIANGLE);
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[a];
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[a];
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[a].clone();
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b];
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[b];
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[b].clone();
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d];
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[d];
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[d].clone();
                    this.data.push(face);
                    var face = new Simplex(Simplex.K_FOR_TRIANGLE);
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b];
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[b];
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[b].clone();
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[c];
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[c];
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[c].clone();
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d];
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[d];
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[d].clone();
                    this.data.push(face);
                }
            }
            this.setModified(false);
        };
        return VortexGeometry;
    })(Geometry);
    return VortexGeometry;
});
