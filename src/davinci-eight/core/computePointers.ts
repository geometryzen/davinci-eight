import Attribute from './Attribute'
import Primitive from './Primitive'
import VertexAttribPointer from './VertexAttribPointer'

export default function computePointers(primitive: Primitive, attributeNames: string[]): VertexAttribPointer[] {
    const attribs = primitive.attributes
    const kLen = attributeNames.length

    const pointers: VertexAttribPointer[] = []
    let offset = 0
    for (let k = 0; k < kLen; k++) {
        const aName = attributeNames[k]
        const attrib: Attribute = attribs[aName]
        pointers.push({ name: aName, size: attrib.size, normalized: true, offset: offset })
        offset += attrib.size * 4 // We're assuming that the data type is gl.FLOAT
    }
    return pointers
}
