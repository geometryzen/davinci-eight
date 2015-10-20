var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/ConeGeometry', '../geometries/CylinderGeometry', '../geometries/AxialGeometry', '../checks/mustBeBoolean', '../geometries/RingGeometry', '../math/Vector3'], function (require, exports, ConeGeometry, CylinderGeometry, AxialGeometry, mustBeBoolean, RingGeometry, Vector3) {
    /**
     * @class ArrowGeometry
     */
    var ArrowGeometry = (function (_super) {
        __extends(ArrowGeometry, _super);
        /**
         * @class ArrowGeometry
         * @constructor
         */
        function ArrowGeometry() {
            _super.call(this);
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
            this.thetaSegments = 8;
        }
        /**
         * @method setPosition
         * @param position {Cartesian3}
         * @return {ArrowGeometry}
         * @chainable
         */
        ArrowGeometry.prototype.setPosition = function (position) {
            this.position = position;
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
            var back = Vector3.copy(this.axis).scale(-1);
            /**
             * The neck is the place where the cone meets the shaft.
             */
            var neck = Vector3.copy(this.axis).scale(heightShaft).add(this.position);
            /**
             * The tail is the the position of the blunt end of the arrow.
             */
            var tail = Vector3.copy(this.position);
            var cone = new ConeGeometry();
            cone.radius = this.radiusCone;
            cone.height = this.heightCone;
            cone.position = neck;
            cone.axis = this.axis;
            cone.sliceAngle = this.sliceAngle;
            cone.sliceStart = this.sliceStart;
            cone.thetaSegments = this.thetaSegments;
            cone.useTextureCoords = this.useTextureCoords;
            /**
             * The `disc` fills the space between the cone and the shaft.
             */
            var disc = new RingGeometry();
            disc.innerRadius = this.radiusShaft;
            disc.outerRadius = this.radiusCone;
            disc.position = neck;
            disc.axis = back;
            disc.sliceAngle = -this.sliceAngle;
            disc.sliceStart = this.sliceStart;
            disc.thetaSegments = this.thetaSegments;
            disc.useTextureCoords = this.useTextureCoords;
            /**
             * The `shaft` is the slim part of the arrow.
             */
            var shaft = new CylinderGeometry();
            shaft.radius = this.radiusShaft;
            shaft.height = heightShaft;
            shaft.position = tail;
            shaft.axis = this.axis;
            shaft.sliceAngle = this.sliceAngle;
            shaft.sliceStart = this.sliceStart;
            shaft.thetaSegments = this.thetaSegments;
            shaft.useTextureCoords = this.useTextureCoords;
            /**
             * The `plug` fills the end of the shaft.
             */
            var plug = new RingGeometry();
            plug.innerRadius = 0;
            plug.outerRadius = this.radiusShaft;
            plug.position = tail;
            plug.axis = back;
            plug.sliceAngle = -this.sliceAngle;
            plug.sliceStart = this.sliceStart;
            plug.thetaSegments = this.thetaSegments;
            plug.useTextureCoords = this.useTextureCoords;
            return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce(function (a, b) { return a.concat(b); }, []);
        };
        ArrowGeometry.prototype.enableTextureCoords = function (enable) {
            mustBeBoolean('enable', enable);
            this.useTextureCoords = enable;
            return this;
        };
        return ArrowGeometry;
    })(AxialGeometry);
    return ArrowGeometry;
});
