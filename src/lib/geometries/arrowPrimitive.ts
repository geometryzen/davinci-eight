import { isDefined } from '../checks/isDefined';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeObject } from '../checks/mustBeObject';
import { Primitive } from '../core/Primitive';
import { vec } from '../math/R3';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';
import { ArrowBuilder } from '../shapes/ArrowBuilder';
import { ArrowGeometryOptions } from './ArrowGeometryOptions';

/**
 * @hidden
 * The canonical axis is e2.
 */
const canonicalAxis = vec(0, 1, 0);
/**
 * @hidden
 * The canonical cut line is e3.
 */
const canonicalCutLine = vec(0, 0, 1);

/**
 * @hidden
 * Used by the ArrowBuilder to define an axis.
 * @param options Contains an optional `axis` property
 * @returns the `axis` property (if it is defined), otherwise, the canonical axis, e2.
 */
const getAxis = function getAxis(options: Pick<ArrowGeometryOptions, 'axis'>): VectorE3 {
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
const getCutLine = function getCutLine(options: Pick<ArrowGeometryOptions, 'meridian'>): VectorE3 {
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
export function arrowPrimitive(options: Pick<ArrowGeometryOptions, 'kind' | 'axis' | 'meridian' | 'radiusCone' | 'stress' | 'thetaSegments' | 'offset'> = { kind: 'ArrowGeometry' }): Primitive {
    mustBeObject('options', options);

    const builder = new ArrowBuilder(getAxis(options), getCutLine(options), false);

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
