/**
 * Computes the stride for a given collection of attributes.
 */
export function computeStride(attributes, aNames) {
    var aNamesLen = aNames.length;
    var stride = 0;
    for (var a = 0; a < aNamesLen; a++) {
        var aName = aNames[a];
        var attrib = attributes[aName];
        stride += attrib.size * 4; // We're assuming that the data type is gl.FLOAT
    }
    return stride;
}
