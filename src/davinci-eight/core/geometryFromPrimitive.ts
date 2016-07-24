import ContextManager from './ContextManager';
import {Geometry} from './Geometry';
import GeometryArrays from './GeometryArrays';
import GeometryElements from './GeometryElements';
import mustBeArray from '../checks/mustBeArray';
import Primitive from './Primitive';
import SpinorE3 from '../math/SpinorE3';

/**
 * Computes a Geometry from the specified primitive.
 *
 * @deprecated If you use this function then you will not be able to properly handle scaling/tilt.
 * The preferred approach is to subclass either GeometryElements or GeometryArrays.
 * 
 * @param primitive
 * @param tilt The rotor that was used to move the primitive from canonical configuration to the reference configuration.
 * @param manager
 * @param order
 */
export default function geometryFromPrimitive(primitive: Primitive, contextManager: ContextManager, options: { order?: string[]; tilt?: SpinorE3 } = {}): Geometry {
    if (options.order) {
        mustBeArray('order', options.order);
    }
    if (primitive.indices) {
        return new GeometryElements(primitive, contextManager, options, 0);
    }
    else {
        return new GeometryArrays(primitive, contextManager, options, 0);
    }
}
