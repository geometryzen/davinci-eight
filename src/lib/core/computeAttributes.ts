import { Attribute } from './Attribute';
import { computeCount } from './computeCount';

/**
 * Computes the interleaved attribute values array.
 */
export function computeAttributes(attributes: { [name: string]: Attribute }, aNames: string[]): number[] {
    const aNamesLen = aNames.length;

    const values: number[] = [];
    const iLen = computeCount(attributes, aNames);
    for (let i = 0; i < iLen; i++) {
        // Looping over the attribute name as the inner loop creates the interleaving.
        for (let a = 0; a < aNamesLen; a++) {
            const aName = aNames[a];
            const attrib: Attribute = attributes[aName];
            const size = attrib.size;
            for (let s = 0; s < size; s++) {
                values.push(attrib.values[i * size + s]);
            }
        }
    }
    return values;
}
