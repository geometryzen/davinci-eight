import { mustBeInteger } from '../checks/mustBeInteger';
import { Attribute } from './Attribute';

/**
 * Computes the number of elements represented by the attribute values.
 * @hidden
 */
export function computeCount(attribs: { [name: string]: Attribute }, aNames: string[]): number {
    const aNamesLen = aNames.length;
    // TODO: We currently return after computing the count for the first aName, but we should
    // perform a consistency check.
    for (let a = 0; a < aNamesLen; a++) {
        const aName = aNames[a];
        const attrib: Attribute = attribs[aName];
        const vLength = attrib.values.length;
        const size = mustBeInteger('size', attrib.size);
        return vLength / size;
    }
    return 0;
}
