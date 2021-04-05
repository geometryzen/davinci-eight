import { __extends } from "tslib";
import { reduce } from '../atoms/reduce';
import { mustBeDefined } from '../checks/mustBeDefined';
import { Vector3 } from '../math/Vector3';
import { RingBuilder } from '../shapes/RingBuilder';
import { AxialShapeBuilder } from './AxialShapeBuilder';
import { ConeBuilder } from './ConeBuilder';
/**
 * @hidden
 */
var ArrowHeadBuilder = /** @class */ (function (_super) {
    __extends(ArrowHeadBuilder, _super);
    /**
     *
     * @param axis The direction of the arrow. The argument is normalized to a unit vector.
     * @param cutLine The direction of the start of the arrow slice. The argument is normalized to a unit vector.
     * @param clockwise The orientation
     */
    function ArrowHeadBuilder(axis, cutLine, clockwise) {
        var _this = _super.call(this) || this;
        _this.heightCone = 0.20;
        _this.radiusCone = 0.08;
        _this.radiusShaft = 0.01;
        _this.thetaSegments = 16;
        mustBeDefined('axis', axis);
        mustBeDefined('cutLine', cutLine);
        _this.e = Vector3.copy(axis).normalize();
        _this.cutLine = Vector3.copy(cutLine).normalize();
        _this.clockwise = clockwise;
        return _this;
    }
    /**
     *
     */
    ArrowHeadBuilder.prototype.toPrimitive = function () {
        /**
         * The opposite direction to the axis.
         */
        var back = Vector3.copy(this.e).neg();
        /**
         * The neck is the place where the cone meets the shaft.
         */
        var neck = Vector3.copy(this.offset);
        neck.rotate(this.tilt);
        /**
         * The `cone` forms the head of the arrow.
         */
        var cone = new ConeBuilder();
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
        var ring = new RingBuilder();
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
        return reduce([cone.toPrimitive(), ring.toPrimitive()]);
    };
    return ArrowHeadBuilder;
}(AxialShapeBuilder));
export { ArrowHeadBuilder };
