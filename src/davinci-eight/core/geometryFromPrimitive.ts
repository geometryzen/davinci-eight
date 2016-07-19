import {Engine} from './Engine';
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
 * @param engine
 * @param order
 */
export default function geometryFromPrimitive(primitive: Primitive, engine: Engine, options: { order?: string[]; tilt?: SpinorE3 } = {}): Geometry {
    if (!(engine instanceof Engine)) {
        throw new TypeError("engine must be an Engine");
    }
    if (options.order) {
        mustBeArray('order', options.order);
    }
    if (primitive.indices) {
        return new GeometryElements(primitive, engine, options, 0);
    }
    else {
        return new GeometryArrays(primitive, engine, options, 0);
    }
}
