import ArrowBuilder from '../shapes/ArrowBuilder';
import ArrowGeometryOptions from './ArrowGeometryOptions';
import isDefined from '../checks/isDefined';
import mustBeObject from '../checks/mustBeObject';
import mustBeNumber from '../checks/mustBeNumber';
import Primitive from '../core/Primitive';
import Vector3 from '../math/Vector3';
import Spinor3 from '../math/Spinor3';

/**
 * 
 */
export default function arrowPrimitive(options: ArrowGeometryOptions = { kind: 'ArrowGeometry' }): Primitive {
    mustBeObject('options', options);

    const builder = new ArrowBuilder(Vector3.vector(0, 1, 0), Vector3.vector(0, 0, 1), false);

    if (isDefined(options.radiusCone)) {
        builder.radiusCone = mustBeNumber("options.radiusCone", options.radiusCone);
    }

    builder.stress.copy(isDefined(options.stress) ? options.stress : Vector3.vector(1, 1, 1));
    builder.tilt.copySpinor(isDefined(options.tilt) ? options.tilt : Spinor3.one());
    builder.offset.copy(isDefined(options.offset) ? options.offset : Vector3.zero());
    return builder.toPrimitive();
}
