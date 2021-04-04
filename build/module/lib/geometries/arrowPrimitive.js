import { isDefined } from '../checks/isDefined';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeObject } from '../checks/mustBeObject';
import { vec } from '../math/R3';
import { Vector3 } from '../math/Vector3';
import { ArrowBuilder } from '../shapes/ArrowBuilder';
import { ArrowHeadBuilder } from '../shapes/ArrowHeadBuilder';
import { ArrowTailBuilder } from '../shapes/ArrowTailBuilder';
/**
 * @hidden
 * The canonical axis is e2.
 */
var canonicalAxis = vec(0, 1, 0);
/**
 * @hidden
 * The canonical cut line is e3.
 */
var canonicalCutLine = vec(0, 0, 1);
/**
 * @hidden
 * Used by the ArrowBuilder to define an axis.
 * @param options Contains an optional `axis` property
 * @returns the `axis` property (if it is defined), otherwise, the canonical axis, e2.
 */
var getAxis = function getAxis(options) {
    if (isDefined(options.axis)) {
        return options.axis;
    }
    else {
        return canonicalAxis;
    }
};
/**
 * @hidden
 * Used by the ArrowBuilder to define a cut line (meridian).
 * @param options Contains an optional `meridian` property.
 * @returns the `meridian` property (if it is defined), otherwise, the canonical cut line, e3.
 */
var getCutLine = function getCutLine(options) {
    if (isDefined(options.meridian)) {
        return options.meridian;
    }
    else {
        return canonicalCutLine;
    }
};
/**
 * @hidden
 * Used by the ArrowGeometry constructor.
 */
export function arrowPrimitive(options) {
    if (options === void 0) { options = { kind: 'ArrowGeometry' }; }
    mustBeObject('options', options);
    var builder = new ArrowBuilder(getAxis(options), getCutLine(options), false);
    if (isDefined(options.radiusCone)) {
        builder.radiusCone = mustBeNumber("options.radiusCone", options.radiusCone);
    }
    if (isDefined(options.thetaSegments)) {
        builder.thetaSegments = mustBeInteger("options.thetaSegments", options.thetaSegments);
    }
    builder.stress.copy(isDefined(options.stress) ? options.stress : Vector3.vector(1, 1, 1));
    builder.offset.copy(isDefined(options.offset) ? options.offset : Vector3.zero());
    return builder.toPrimitive();
}
/**
 * @hidden
 */
export function arrowHeadPrimitive(options) {
    if (options === void 0) { options = {}; }
    mustBeObject('options', options);
    var builder = new ArrowHeadBuilder(getAxis(options), getCutLine(options), false);
    if (isDefined(options.heightCone)) {
        builder.heightCone = mustBeNumber("options.heightCone", options.heightCone);
    }
    if (isDefined(options.radiusCone)) {
        builder.radiusCone = mustBeNumber("options.radiusCone", options.radiusCone);
    }
    if (isDefined(options.thetaSegments)) {
        builder.thetaSegments = mustBeInteger("options.thetaSegments", options.thetaSegments);
    }
    builder.stress.copy(isDefined(options.stress) ? options.stress : Vector3.vector(1, 1, 1));
    builder.offset.copy(isDefined(options.offset) ? options.offset : Vector3.zero());
    return builder.toPrimitive();
}
/**
 * @hidden
 */
export function arrowTailPrimitive(options) {
    if (options === void 0) { options = {}; }
    mustBeObject('options', options);
    var builder = new ArrowTailBuilder(getAxis(options), getCutLine(options), false);
    if (isDefined(options.heightShaft)) {
        builder.heightShaft = mustBeNumber("options.heightShaft", options.heightShaft);
    }
    if (isDefined(options.radiusShaft)) {
        builder.radiusShaft = mustBeNumber("options.radiusShaft", options.radiusShaft);
    }
    if (isDefined(options.thetaSegments)) {
        builder.thetaSegments = mustBeInteger("options.thetaSegments", options.thetaSegments);
    }
    builder.stress.copy(isDefined(options.stress) ? options.stress : Vector3.vector(1, 1, 1));
    builder.offset.copy(isDefined(options.offset) ? options.offset : Vector3.zero());
    return builder.toPrimitive();
}
