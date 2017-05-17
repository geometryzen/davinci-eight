import { ArrowBuilder } from '../shapes/ArrowBuilder';
import { isDefined } from '../checks/isDefined';
import { mustBeObject } from '../checks/mustBeObject';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Vector3 } from '../math/Vector3';
import { vec } from '../math/R3';
var canonicalAxis = vec(0, 1, 0);
var canonicalCutLine = vec(0, 0, 1);
var getAxis = function getAxis(options) {
    if (isDefined(options.axis)) {
        return options.axis;
    }
    else {
        return canonicalAxis;
    }
};
var getCutLine = function getCutLine(options) {
    if (isDefined(options.meridian)) {
        return options.meridian;
    }
    else {
        return canonicalCutLine;
    }
};
/**
 *
 */
export function arrowPrimitive(options) {
    if (options === void 0) { options = { kind: 'ArrowGeometry' }; }
    mustBeObject('options', options);
    var builder = new ArrowBuilder(getAxis(options), getCutLine(options), false);
    if (isDefined(options.radiusCone)) {
        builder.radiusCone = mustBeNumber("options.radiusCone", options.radiusCone);
    }
    builder.stress.copy(isDefined(options.stress) ? options.stress : Vector3.vector(1, 1, 1));
    builder.offset.copy(isDefined(options.offset) ? options.offset : Vector3.zero());
    return builder.toPrimitive();
}
