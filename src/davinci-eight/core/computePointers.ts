import Attribute from './Attribute'
import VertexAttribPointer from './VertexAttribPointer'

export default function(attributes: { [name: string]: Attribute }, aNames: string[]): VertexAttribPointer[] {
  const aNamesLen = aNames.length

  const pointers: VertexAttribPointer[] = []
  let offset = 0
  for (let a = 0; a < aNamesLen; a++) {
    const aName = aNames[a]
    const attrib: Attribute = attributes[aName]
    pointers.push({ name: aName, size: attrib.size, normalized: true, offset: offset })
    offset += attrib.size * 4 // We're assuming that the data type is gl.FLOAT
  }
  return pointers
}
