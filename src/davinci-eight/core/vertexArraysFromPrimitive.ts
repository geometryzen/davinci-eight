import computeAttributes from './computeAttributes'
import computePointers from './computePointers'
import computeStride from './computeStride'
import Primitive from './Primitive'
import VertexArrays from './VertexArrays'

export default function(primitive: Primitive, order?: string[]): VertexArrays {

    const keys = order ? order : Object.keys(primitive.attributes)

    const that: VertexArrays = {
        drawMode: primitive.mode,
        indices: primitive.indices,
        attributes: computeAttributes(primitive, keys),
        stride: computeStride(primitive, keys),
        pointers: computePointers(primitive, keys)
    }

    return that
}
