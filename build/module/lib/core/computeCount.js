import { mustBeInteger } from '../checks/mustBeInteger';
/**
 * Computes the number of elements represented by the attribute values.
 */
export function computeCount(attribs, aNames) {
    var aNamesLen = aNames.length;
    // TODO: We currently return after computing the count for the first aName, but we should
    // perform a consistency check.
    for (var a = 0; a < aNamesLen; a++) {
        var aName = aNames[a];
        var attrib = attribs[aName];
        var vLength = attrib.values.length;
        var size = mustBeInteger('size', attrib.size);
        return vLength / size;
    }
    return 0;
}
