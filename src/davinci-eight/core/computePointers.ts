import Attribute from './Attribute'
import VertexAttribPointer from './VertexAttribPointer'

/**
 * @deprecated
 */
export default function computePointers(attributes: { [name: string]: Attribute }, aNames: string[]): VertexAttribPointer[] {
    const aNamesLen = aNames.length;

    const pointers: VertexAttribPointer[] = [];
    let offset = 0;
    for (let a = 0; a < aNamesLen; a++) {
        const aName = aNames[a];
        const attrib: Attribute = attributes[aName];
        // FIXME: It's a lot more complicated choosing these parameters than for the simple FLOAT case.
        pointers.push({ name: aName, size: attrib.size, type: attrib.type, normalized: true, offset: offset })
        offset += attrib.size * 4 // We're assuming that the data type is gl.FLOAT
    }
    return pointers
}
