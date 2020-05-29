"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeAttributes = void 0;
var computeCount_1 = require("./computeCount");
/**
 * Computes the interleaved attribute values array.
 */
function computeAttributes(attributes, aNames) {
    var aNamesLen = aNames.length;
    var values = [];
    var iLen = computeCount_1.computeCount(attributes, aNames);
    for (var i = 0; i < iLen; i++) {
        // Looping over the attribute name as the inner loop creates the interleaving.
        for (var a = 0; a < aNamesLen; a++) {
            var aName = aNames[a];
            var attrib = attributes[aName];
            var size = attrib.size;
            for (var s = 0; s < size; s++) {
                values.push(attrib.values[i * size + s]);
            }
        }
    }
    return values;
}
exports.computeAttributes = computeAttributes;
