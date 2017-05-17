import { BeginMode } from '../core/BeginMode';
function copyIndices(src, dest, delta) {
    if (src.indices) {
        var iLen = src.indices.length;
        for (var i = 0; i < iLen; i++) {
            dest.push(src.indices[i] + delta);
        }
    }
}
function max(xs) {
    return xs.reduce(function (a, b) { return a > b ? a : b; });
}
function joinIndices(previous, current, dest) {
    if (previous.indices) {
        var lastIndex = previous.indices[previous.indices.length - 1];
        if (current.indices) {
            var nextIndex = current.indices[0] + max(previous.indices) + 1;
            // Make this triangle degenerate.
            dest.push(lastIndex);
            // Join to the next triangle strip.
            dest.push(nextIndex);
        }
    }
}
function ensureAttribute(attributes, name, size, type) {
    if (!attributes[name]) {
        attributes[name] = { values: [], size: size, type: type };
    }
    return attributes[name];
}
function copyAttributes(primitive, attributes) {
    var keys = Object.keys(primitive.attributes);
    var kLen = keys.length;
    for (var k = 0; k < kLen; k++) {
        var key = keys[k];
        var srcAttrib = primitive.attributes[key];
        var dstAttrib = ensureAttribute(attributes, key, srcAttrib.size, srcAttrib.type);
        var svalues = srcAttrib.values;
        var vLen = svalues.length;
        for (var v = 0; v < vLen; v++) {
            dstAttrib.values.push(svalues[v]);
        }
    }
}
/**
 * reduces multiple TRIANGLE_STRIP Primitives to a single TRAINGLE_STRIP Primitive.
 */
export function reduce(primitives) {
    for (var i = 0; i < primitives.length; i++) {
        var primitive = primitives[i];
        if (primitive.mode !== BeginMode.TRIANGLE_STRIP) {
            throw new Error("mode (" + primitive.mode + ") must be TRIANGLE_STRIP");
        }
    }
    return primitives.reduce(function (previous, current) {
        var indices = [];
        copyIndices(previous, indices, 0);
        joinIndices(previous, current, indices);
        copyIndices(current, indices, max(previous.indices) + 1);
        var attributes = {};
        copyAttributes(previous, attributes);
        copyAttributes(current, attributes);
        return {
            mode: BeginMode.TRIANGLE_STRIP,
            indices: indices,
            attributes: attributes
        };
    });
}
