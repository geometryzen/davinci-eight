var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/ConeGeometry', '../geometries/CylinderGeometry', '../geometries/AxialGeometry', '../geometries/RingGeometry', '../math/R3'], function (require, exports, ConeGeometry, CylinderGeometry, AxialGeometry, RingGeometry, R3) {
    /**
     * @class ArrowGeometry
     */
    var ArrowGeometry = (function (_super) {
        __extends(ArrowGeometry, _super);
        /**
         * @class ArrowGeometry
         * @constructor
         * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
         * @param sliceStart [VectorE3] A direction, orthogonal to <code>axis</code>.
         */
        function ArrowGeometry(axis, sliceStart) {
            _super.call(this, axis, sliceStart);
            /**
             * @property heightCone
             * @type {number}
             */
            this.heightCone = 0.20;
            /**
             * @property radiusCone
             * @type {number}
             */
            this.radiusCone = 0.08;
            /**
             * @property radiusShaft
             * @type {number}
             */
            this.radiusShaft = 0.01;
            /**
             * @property thetaSegments
             * @type {number}
             */
            this.thetaSegments = 16;
        }
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {ArrowGeometry}
         * @chainable
         */
        ArrowGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method setAxis
         * @param axis {VectorE3}
         * @return {ArrowGeometry}
         * @chaninable
         */
        ArrowGeometry.prototype.setAxis = function (axis) {
            _super.prototype.setAxis.call(this, axis);
            return this;
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        ArrowGeometry.prototype.toPrimitives = function () {
            var heightShaft = 1 - this.heightCone;
            /**
             * The opposite direction to the axis.
             */
            var back = R3.copy(this.axis).scale(-1);
            /**
             * The neck is the place where the cone meets the shaft.
             */
            var neck = R3.copy(this.axis).scale(heightShaft).add(this.position);
            /**
             * The tail is the the position of the blunt end of the arrow.
             */
            var tail = R3.copy(this.position);
            var cone = new ConeGeometry(this.axis, this.sliceStart);
            cone.radius = this.radiusCone;
            cone.height = this.heightCone;
            cone.setPosition(neck);
            cone.axis = this.axis;
            cone.sliceAngle = this.sliceAngle;
            cone.thetaSegments = this.thetaSegments;
            cone.useTextureCoords = this.useTextureCoords;
            /**
             * The `disc` fills the space between the cone and the shaft.
             */
            var disc = new RingGeometry(back, this.sliceStart);
            disc.innerRadius = this.radiusShaft;
            disc.outerRadius = this.radiusCone;
            disc.setPosition(neck);
            disc.sliceAngle = -this.sliceAngle;
            disc.thetaSegments = this.thetaSegments;
            disc.useTextureCoords = this.useTextureCoords;
            /**
             * The `shaft` is the slim part of the arrow.
             */
            var shaft = new CylinderGeometry(this.axis, this.sliceStart);
            shaft.radius = this.radiusShaft;
            shaft.height = heightShaft;
            shaft.setPosition(tail);
            shaft.sliceAngle = this.sliceAngle;
            shaft.thetaSegments = this.thetaSegments;
            shaft.useTextureCoords = this.useTextureCoords;
            /**
             * The `plug` fills the end of the shaft.
             */
            var plug = new RingGeometry(back, this.sliceStart);
            plug.innerRadius = 0;
            plug.outerRadius = this.radiusShaft;
            plug.setPosition(tail);
            plug.sliceAngle = -this.sliceAngle;
            plug.thetaSegments = this.thetaSegments;
            plug.useTextureCoords = this.useTextureCoords;
            return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce(function (a, b) { return a.concat(b); }, []);
        };
        ArrowGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return ArrowGeometry;
    })(AxialGeometry);
    return ArrowGeometry;
});
