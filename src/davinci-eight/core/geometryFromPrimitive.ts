import vertexArraysFromPrimitive from './vertexArraysFromPrimitive';
import GeometryArrays from './GeometryArrays';
import GeometryElements from './GeometryElements';
import Primitive from './Primitive';
import {Engine} from './Engine';
import {Geometry} from './Geometry';
import SpinorE3 from '../math/SpinorE3';

/**
 * Computes a Geometry from the specified primitive.
 * @param primitive
 * @param tilt The rotor that was used to move the primitive from canonical configuration to the reference configuration.
 * @param engine
 * @param order
 */
export default function geometryFromPrimitive(primitive: Primitive, tilt: SpinorE3, engine: Engine, order?: string[]): Geometry {
    const data = vertexArraysFromPrimitive(primitive, order);
    if (primitive.indices) {
        return new GeometryElements(data, tilt, engine);
    }
    else {
        return new GeometryArrays(data, tilt, engine);
    }
}
