import { Attribute } from './Attribute';

/**
 * Computes the stride for a given collection of attributes.
 */
export function computeStride(attributes: { [name: string]: Attribute }, aNames: string[]): number {

    const aNamesLen = aNames.length;

    let stride = 0;
    for (let a = 0; a < aNamesLen; a++) {
        const aName = aNames[a];
        const attrib: Attribute = attributes[aName];
        stride += attrib.size * 4; // We're assuming that the data type is gl.FLOAT
    }
    return stride;
}
