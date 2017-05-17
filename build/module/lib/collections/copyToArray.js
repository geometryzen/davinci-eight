export function copyToArray(source, destination, offset) {
    if (destination === void 0) { destination = []; }
    if (offset === void 0) { offset = 0; }
    var length = source.length;
    for (var i = 0; i < length; i++) {
        destination[offset + i] = source[i];
    }
    return destination;
}
