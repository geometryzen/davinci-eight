import Attribute from './Attribute'
import Primitive from './Primitive'

export default function computePointers(primitive: Primitive, attributeNames: string[]): number {

    const attribs = primitive.attributes
    const kLen = attributeNames.length

    let stride = 0
    for (let k = 0; k < kLen; k++) {
        const aName = attributeNames[k]
        const attrib: Attribute = attribs[aName]
        stride += attrib.size * 4 // We're assuming that the data type is gl.FLOAT
    }
    return stride
}
