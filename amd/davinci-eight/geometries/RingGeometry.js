var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/Geometry', '../geometries/Simplex', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, Geometry, Simplex, Symbolic, Vector2, Vector3) {
    /**
     * @class RingGeometry
     * @extends Geometry
     */
    var RingGeometry = (function (_super) {
        __extends(RingGeometry, _super);
        /**
         * Creates an annulus with a single hole.
         * @class RingGeometry
         * @constructor
         */
        function RingGeometry(a, b, e) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (e === void 0) { e = Vector3.e3; }
            _super.call(this, 'RingGeometry');
            this.a = a;
            this.b = b;
            this.e = Vector3.copy(e);
            this.radialSegments = 8;
            this.thetaSegments = 8;
            this.thetaStart = 0;
            this.thetaLength = 2 * Math.PI;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        RingGeometry.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        /**
         * @method isModified
         * @return {boolean}
         */
        RingGeometry.prototype.isModified = function () {
            return _super.prototype.isModified.call(this);
        };
        /**
         * @method recalculate
         * @return {void}
         */
        RingGeometry.prototype.recalculate = function () {
            this.data = [];
            var radialSegments = this.radialSegments;
            var thetaSegments = this.thetaSegments;
            var thetaStart = this.thetaStart;
            var thetaLength = this.thetaLength;
            var a = this.a;
            var b = this.b;
            var vertices = [];
            var uvs = [];
            var radius = this.b;
            var radiusStep = (a - b) / radialSegments;
            for (var i = 0; i < radialSegments + 1; i++) {
                for (var j = 0; j < thetaSegments + 1; j++) {
                    var vertex = new Vector3();
                    var theta = thetaStart + j / thetaSegments * thetaLength;
                    vertex.x = radius * Math.cos(theta);
                    vertex.y = radius * Math.sin(theta);
                    vertices.push(vertex);
                    uvs.push(new Vector2([(vertex.x / a + 1) / 2, (vertex.y / a + 1) / 2]));
                }
                radius += radiusStep;
            }
            var n = Vector3.e3.clone();
            for (i = 0; i < radialSegments; i++) {
                var thetaSegment = i * (thetaSegments + 1);
                for (j = 0; j < thetaSegments; j++) {
                    // number of segments per circle
                    var segment = j + thetaSegment;
                    var v1 = segment;
                    var v2 = segment + thetaSegments + 1;
                    var v3 = segment + thetaSegments + 2;
                    var simplex = new Simplex(Simplex.K_FOR_TRIANGLE);
                    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v1];
                    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = n;
                    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v1].clone();
                    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v2];
                    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = n;
                    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v2].clone();
                    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v3];
                    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = n;
                    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v3].clone();
                    this.data.push(simplex);
                    v1 = segment;
                    v2 = segment + thetaSegments + 2;
                    v3 = segment + 1;
                    var simplex = new Simplex(Simplex.K_FOR_TRIANGLE);
                    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v1];
                    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = n;
                    simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v1].clone();
                    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v2];
                    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = n;
                    simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v2].clone();
                    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v3];
                    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = n;
                    simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v3].clone();
                    this.data.push(simplex);
                }
            }
            this.setModified(false);
        };
        /**
         * @method setModified
         * @param modified {boolean}
         * @return {RingGeometry}
         * @chainable
         */
        RingGeometry.prototype.setModified = function (modified) {
            return this;
        };
        return RingGeometry;
    })(Geometry);
    return RingGeometry;
});
