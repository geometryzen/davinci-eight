import Attribute from './Attribute'
import Primitive from './Primitive'
import VertexAttribPointer from './VertexAttribPointer'

export default function(primitive: Primitive, aNames: string[]): VertexAttribPointer[] {
  const attribs = primitive.attributes
  const aNamesLen = aNames.length

  const pointers: VertexAttribPointer[] = []
  let offset = 0
  for (let a = 0; a < aNamesLen; a++) {
    const aName = aNames[a]
    const attrib: Attribute = attribs[aName]
    pointers.push({ name: aName, size: attrib.size, normalized: true, offset: offset })
    offset += attrib.size * 4 // We're assuming that the data type is gl.FLOAT
  }
  return pointers
}
