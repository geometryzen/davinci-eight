"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vertexArraysFromPrimitive = void 0;
var computeAttributes_1 = require("./computeAttributes");
var computePointers_1 = require("./computePointers");
var computeStride_1 = require("./computeStride");
/**
 * Converts the Primitive to the interleaved VertexArrays format.
 * This conversion is performed for eddiciency; it allows multiple attributes to be
 * combined into a single array of numbers so that it may be stored in a single vertex buffer.
 *
 * @param primitive The Primitive to be converted.
 * @param order The ordering of the attributes.
 */
function vertexArraysFromPrimitive(primitive, order) {
    if (primitive) {
        var keys = order ? order : Object.keys(primitive.attributes);
        var that = {
            mode: primitive.mode,
            indices: primitive.indices,
            attributes: computeAttributes_1.computeAttributes(primitive.attributes, keys),
            stride: computeStride_1.computeStride(primitive.attributes, keys),
            pointers: computePointers_1.computePointers(primitive.attributes, keys)
        };
        return that;
    }
    else {
        return void 0;
    }
}
exports.vertexArraysFromPrimitive = vertexArraysFromPrimitive;
