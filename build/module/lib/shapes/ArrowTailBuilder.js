import { __extends } from "tslib";
import { reduce } from '../atoms/reduce';
import { mustBeDefined } from '../checks/mustBeDefined';
import { Vector3 } from '../math/Vector3';
import { CylindricalShellBuilder } from './CylindricalShellBuilder';
import { RingBuilder } from './RingBuilder';
import { AxialShapeBuilder } from './AxialShapeBuilder';
/**
 * @hidden
 */
var ArrowTailBuilder = /** @class */ (function (_super) {
    __extends(ArrowTailBuilder, _super);
    /**
     *
     * @param axis The direction of the arrow. The argument is normalized to a unit vector.
     * @param cutLine The direction of the start of the arrow slice. The argument is normalized to a unit vector.
     * @param clockwise The orientation
     */
    function ArrowTailBuilder(axis, cutLine, clockwise) {
        var _this = _super.call(this) || this;
        _this.heightShaft = 0.80;
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
    ArrowTailBuilder.prototype.toPrimitive = function () {
        /**
         * The opposite direction to the axis.
         */
        var back = Vector3.copy(this.e).neg();
        /**
         * The tail is the the position of the blunt end of the arrow.
         */
        var tail = Vector3.copy(this.offset);
        tail.rotate(this.tilt);
        /**
         * The `shaft` is the slim part of the arrow.
         */
        var shaft = new CylindricalShellBuilder();
        shaft.height.copy(this.e).normalize().scale(this.heightShaft);
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
        var plug = new RingBuilder();
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
        return reduce([shaft.toPrimitive(), plug.toPrimitive()]);
    };
    return ArrowTailBuilder;
}(AxialShapeBuilder));
export { ArrowTailBuilder };
