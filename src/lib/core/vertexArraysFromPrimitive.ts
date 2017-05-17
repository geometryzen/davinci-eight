import { computeAttributes } from './computeAttributes';
import { computePointers } from './computePointers';
import { computeStride } from './computeStride';
import { Primitive } from './Primitive';
import { VertexArrays } from './VertexArrays';

/**
 * Converts the Primitive to the interleaved VertexArrays format.
 * This conversion is performed for eddiciency; it allows multiple attributes to be
 * combined into a single array of numbers so that it may be stored in a single vertex buffer.
 * 
 * @param primitive The Primitive to be converted.
 * @param order The ordering of the attributes.
 */
export function vertexArraysFromPrimitive(primitive: Primitive, order?: string[]): VertexArrays {

    if (primitive) {
        const keys = order ? order : Object.keys(primitive.attributes);

        const that: VertexArrays = {
            mode: primitive.mode,
            indices: primitive.indices,
            attributes: computeAttributes(primitive.attributes, keys),
            stride: computeStride(primitive.attributes, keys),
            pointers: computePointers(primitive.attributes, keys)
        };

        return that;
    }
    else {
        return void 0;
    }
}
