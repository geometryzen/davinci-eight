import computeAttributes from './computeAttributes';
import computePointers from './computePointers';
import computeStride from './computeStride';
import Primitive from './Primitive';
import VertexArrays from './VertexArrays';

/**
 * Converts the Primitive to the interleaved VertexArrays format.
 */
export default function vertexArraysFromPrimitive(primitive: Primitive, order?: string[]): VertexArrays {

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
