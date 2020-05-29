"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowBuilder = void 0;
var tslib_1 = require("tslib");
var AxialShapeBuilder_1 = require("./AxialShapeBuilder");
var ConicalShellBuilder_1 = require("../shapes/ConicalShellBuilder");
var CylindricalShellBuilder_1 = require("../shapes/CylindricalShellBuilder");
var mustBeDefined_1 = require("../checks/mustBeDefined");
var reduce_1 = require("../atoms/reduce");
var RingBuilder_1 = require("../shapes/RingBuilder");
var Vector3_1 = require("../math/Vector3");
/**
 * <p>
 * This class does not default the initial <b>axis</b>.
 * </p>
 * <p>
 * This class does not default the <b>cutLine</b>.
 * </p>
 */
var ArrowBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(ArrowBuilder, _super);
    /**
     *
     * @param axis The direction of the arrow. The argument is normalized to a unit vector.
     * @param cutLine The direction of the start of the arrow slice. The argument is normalized to a unit vector.
     * @param clockwise The orientation
     */
    function ArrowBuilder(axis, cutLine, clockwise) {
        var _this = _super.call(this) || this;
        _this.heightCone = 0.20;
        _this.radiusCone = 0.08;
        _this.radiusShaft = 0.01;
        _this.thetaSegments = 16;
        mustBeDefined_1.mustBeDefined('axis', axis);
        mustBeDefined_1.mustBeDefined('cutLine', cutLine);
        _this.e = Vector3_1.Vector3.copy(axis).normalize();
        _this.cutLine = Vector3_1.Vector3.copy(cutLine).normalize();
        _this.clockwise = clockwise;
        return _this;
    }
    /**
     *
     */
    ArrowBuilder.prototype.toPrimitive = function () {
        var heightShaft = 1 - this.heightCone;
        /**
         * The opposite direction to the axis.
         */
        var back = Vector3_1.Vector3.copy(this.e).neg();
        /**
         * The neck is the place where the cone meets the shaft.
         */
        var neck = Vector3_1.Vector3.copy(this.e).scale(heightShaft).add(this.offset);
        neck.rotate(this.tilt);
        /**
         * The tail is the the position of the blunt end of the arrow.
         */
        var tail = Vector3_1.Vector3.copy(this.offset);
        tail.rotate(this.tilt);
        /**
         * The `cone` forms the head of the arrow.
         */
        var cone = new ConicalShellBuilder_1.ConicalShellBuilder();
        cone.height.copy(this.e).scale(this.heightCone);
        cone.cutLine.copy(this.cutLine).scale(this.radiusCone);
        cone.clockwise = this.clockwise;
        cone.tilt.mul(this.tilt);
        cone.offset.copy(neck);
        cone.sliceAngle = this.sliceAngle;
        cone.thetaSegments = this.thetaSegments;
        cone.useNormal = this.useNormal;
        cone.usePosition = this.usePosition;
        cone.useTextureCoord = this.useTextureCoord;
        /**
         * The `ring` fills the space between the cone and the shaft.
         */
        var ring = new RingBuilder_1.RingBuilder();
        ring.e.copy(back);
        ring.cutLine.copy(this.cutLine);
        ring.clockwise = !this.clockwise;
        ring.innerRadius = this.radiusShaft;
        ring.outerRadius = this.radiusCone;
        ring.tilt.mul(this.tilt);
        ring.offset.copy(neck);
        ring.sliceAngle = this.sliceAngle;
        ring.thetaSegments = this.thetaSegments;
        ring.useNormal = this.useNormal;
        ring.usePosition = this.usePosition;
        ring.useTextureCoord = this.useTextureCoord;
        /**
         * The `shaft` is the slim part of the arrow.
         */
        var shaft = new CylindricalShellBuilder_1.CylindricalShellBuilder();
        shaft.height.copy(this.e).normalize().scale(heightShaft);
        shaft.cutLine.copy(this.cutLine).normalize().scale(this.radiusShaft);
        shaft.clockwise = this.clockwise;
        shaft.tilt.mul(this.tilt);
        shaft.offset.copy(tail);
        shaft.sliceAngle = this.sliceAngle;
        shaft.thetaSegments = this.thetaSegments;
        shaft.useNormal = this.useNormal;
        shaft.usePosition = this.usePosition;
        shaft.useTextureCoord = this.useTextureCoord;
        /**
         * The `plug` fills the end of the shaft.
         */
        var plug = new RingBuilder_1.RingBuilder();
        plug.e.copy(back);
        plug.cutLine.copy(this.cutLine);
        plug.clockwise = !this.clockwise;
        plug.innerRadius = 0;
        plug.outerRadius = this.radiusShaft;
        plug.tilt.mul(this.tilt);
        plug.offset.copy(tail);
        plug.sliceAngle = this.sliceAngle;
        plug.thetaSegments = this.thetaSegments;
        plug.useNormal = this.useNormal;
        plug.usePosition = this.usePosition;
        plug.useTextureCoord = this.useTextureCoord;
        return reduce_1.reduce([cone.toPrimitive(), ring.toPrimitive(), shaft.toPrimitive(), plug.toPrimitive()]);
    };
    return ArrowBuilder;
}(AxialShapeBuilder_1.AxialShapeBuilder));
exports.ArrowBuilder = ArrowBuilder;
