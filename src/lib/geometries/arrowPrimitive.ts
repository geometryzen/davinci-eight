import { isDefined } from '../checks/isDefined';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeObject } from '../checks/mustBeObject';
import { Primitive } from '../core/Primitive';
import { vec } from '../math/R3';
import { Vector3 } from '../math/Vector3';
import { ArrowBuilder } from '../shapes/ArrowBuilder';
import { ArrowGeometryOptions } from './ArrowGeometryOptions';

/**
 * @hidden
 */
const canonicalAxis = vec(0, 1, 0);
/**
 * @hidden
 */
const canonicalCutLine = vec(0, 0, 1);

/**
 * @hidden
 */
const getAxis = function getAxis(options: ArrowGeometryOptions) {
    if (isDefined(options.axis)) {
        return options.axis;
    }
    else {
        return canonicalAxis;
    }
};

/**
 * @hidden
 */
const getCutLine = function getCutLine(options: ArrowGeometryOptions) {
    if (isDefined(options.meridian)) {
        return options.meridian;
    }
    else {
        return canonicalCutLine;
    }
};

/**
 * @hidden
 */
export function arrowPrimitive(options: ArrowGeometryOptions = { kind: 'ArrowGeometry' }): Primitive {
    mustBeObject('options', options);

    const builder = new ArrowBuilder(getAxis(options), getCutLine(options), false);

    if (isDefined(options.radiusCone)) {
        builder.radiusCone = mustBeNumber("options.radiusCone", options.radiusCone);
    }

    builder.stress.copy(isDefined(options.stress) ? options.stress : Vector3.vector(1, 1, 1));
    builder.offset.copy(isDefined(options.offset) ? options.offset : Vector3.zero());
    return builder.toPrimitive();
}
