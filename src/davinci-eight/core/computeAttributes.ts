import Attribute from './Attribute'
import mustBeInteger from '../checks/mustBeInteger'
import Primitive from './Primitive'
/*
function uniqueIndices(indices: number[]): number[] {
  const s: { [value: number]: number } = {}
  for (let i = 0; i < indices.length; i++) {
    const index = indices[i]
    s[index] = index
  }
  const uniques: number[] = []
  const keys = Object.keys(s)
  for (let k = 0; k < keys.length; k++) {
    const key = keys[k]
    const index = s[key]
    uniques.push(index)
  }
  return uniques
}
*/

/**
 * Computes the number of vertices represented by the Primitive attributes.
 *
 * TODO: We're currently just looking at the first attribute. We should do a consistency check.
 */
function getVertexLength(attribs: { [name: string]: Attribute }, aNames: string[]): number {
  const aNamesLen = aNames.length
  for (let a = 0; a < aNamesLen; a++) {
    const aName = aNames[a]
    const attrib: Attribute = attribs[aName]
    const vLength = attrib.values.length
    const size = mustBeInteger('size', attrib.size)
    return vLength / size
  }
  return 0
}

/**
 *
 */
export default function(primitive: Primitive, aNames: string[]): number[] {
  const attribs = primitive.attributes
  const aNamesLen = aNames.length

  const values: number[] = []
  const vertexLen = getVertexLength(attribs, aNames)
  for (let i = 0; i < vertexLen; i++) {
    // Looping over the attribute name as the inner loop creates the interleaving.
    for (let a = 0; a < aNamesLen; a++) {
      const aName = aNames[a]
      const attrib: Attribute = attribs[aName]
      const size = attrib.size
      for (let s = 0; s < size; s++) {
        values.push(attrib.values[i * size + s])
      }
    }
  }
  return values
}
