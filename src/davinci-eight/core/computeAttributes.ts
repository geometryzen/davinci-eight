import Attribute from './Attribute'
import Primitive from './Primitive'

export default function computeAttributes(primitive: Primitive, attributeNames: string[]): number[] {
    const attribs = primitive.attributes
    const kLen = attributeNames.length

    const values: number[] = []
    const iLen = primitive.indices.length
    for (let i = 0; i < iLen; i++) {
        for (let k = 0; k < kLen; k++) {
            const key = attributeNames[k]
            const attrib: Attribute = attribs[key]
            const size = attrib.size
            for (let s = 0; s < size; s++) {
                values.push(attrib.values[i * size + s])
            }
        }
    }
    return values
}
