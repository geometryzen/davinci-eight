"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplicesToPrimitive = void 0;
var copyToArray_1 = require("../collections/copyToArray");
var dataFromVectorN_1 = require("./dataFromVectorN");
var DataType_1 = require("../core/DataType");
var VectorN_1 = require("../math/VectorN");
var DrawAttribute_1 = require("../atoms/DrawAttribute");
var BeginMode_1 = require("../core/BeginMode");
var DrawPrimitive_1 = require("../atoms/DrawPrimitive");
var simplicesToGeometryMeta_1 = require("./simplicesToGeometryMeta");
var computeUniqueVertices_1 = require("./computeUniqueVertices");
var expectArg_1 = require("../checks/expectArg");
var Simplex_1 = require("./Simplex");
var SimplexMode_1 = require("./SimplexMode");
function numberList(size, value) {
    var data = [];
    for (var i = 0; i < size; i++) {
        data.push(value);
    }
    return data;
}
function attribName(name, attribMap) {
    expectArg_1.expectArg('name', name).toBeString();
    expectArg_1.expectArg('attribMap', attribMap).toBeObject();
    var meta = attribMap[name];
    if (meta) {
        var alias = meta.name;
        return alias ? alias : name;
    }
    else {
        throw new Error("Unable to compute name; missing attribute specification for " + name);
    }
}
function attribSize(key, attribMap) {
    expectArg_1.expectArg('key', key).toBeString();
    expectArg_1.expectArg('attribMap', attribMap).toBeObject();
    var meta = attribMap[key];
    if (meta) {
        var size = meta.size;
        // TODO: Override the message...
        expectArg_1.expectArg('size', size).toBeNumber();
        return meta.size;
    }
    else {
        throw new Error("Unable to compute size; missing attribute specification for " + key);
    }
}
function concat(a, b) {
    return a.concat(b);
}
function simplicesToPrimitive(simplices, geometryMeta) {
    expectArg_1.expectArg('simplices', simplices).toBeObject();
    var actuals = simplicesToGeometryMeta_1.simplicesToGeometryMeta(simplices);
    if (geometryMeta) {
        expectArg_1.expectArg('geometryMeta', geometryMeta).toBeObject();
    }
    else {
        geometryMeta = actuals;
    }
    var attribMap = geometryMeta.attributes;
    // Cache the keys and keys.length of the specified attributes and declare a loop index.
    var keys = Object.keys(attribMap);
    var keysLen = keys.length;
    // Side effect is to set the index property, but it will be be the same as the array index. 
    var vertices = computeUniqueVertices_1.computeUniqueVertices(simplices);
    var vsLength = vertices.length;
    // Each simplex produces as many indices as vertices.
    // This is why we need the Vertex to have an temporary index property.
    var indices = simplices.map(Simplex_1.Simplex.indices).reduce(concat, []);
    // Create intermediate data structures for output and to cache dimensions and name.
    // For performance an array will be used whose index is the key index.
    var outputs = [];
    for (var k = 0; k < keysLen; k++) {
        var key = keys[k];
        var dims = attribSize(key, attribMap);
        var data = numberList(vsLength * dims, void 0);
        outputs.push({ data: data, dimensions: dims, name: attribName(key, attribMap) });
    }
    // Accumulate attribute data in intermediate data structures.
    for (var i = 0; i < vsLength; i++) {
        var vertex = vertices[i];
        var vertexAttribs = vertex.attributes;
        if (vertex.index !== i) {
            expectArg_1.expectArg('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
        }
        for (var k = 0; k < keysLen; k++) {
            var output = outputs[k];
            var size = output.dimensions;
            var value = vertexAttribs[keys[k]];
            if (!value) {
                value = new VectorN_1.VectorN(numberList(size, 0), false, size);
            }
            // TODO: Merge functions to avoid creating temporary array.
            var data = dataFromVectorN_1.dataFromVectorN(value);
            copyToArray_1.copyToArray(data, output.data, i * output.dimensions);
        }
    }
    // Copy accumulated attribute arrays to output data structure.
    var attributes = {};
    for (var k = 0; k < keysLen; k++) {
        var output = outputs[k];
        var data = output.data;
        attributes[output.name] = new DrawAttribute_1.DrawAttribute(data, output.dimensions, DataType_1.DataType.FLOAT);
    }
    switch (geometryMeta.k) {
        case SimplexMode_1.SimplexMode.TRIANGLE: {
            return new DrawPrimitive_1.DrawPrimitive(BeginMode_1.BeginMode.TRIANGLES, indices, attributes);
        }
        case SimplexMode_1.SimplexMode.LINE: {
            return new DrawPrimitive_1.DrawPrimitive(BeginMode_1.BeginMode.LINES, indices, attributes);
        }
        case SimplexMode_1.SimplexMode.POINT: {
            return new DrawPrimitive_1.DrawPrimitive(BeginMode_1.BeginMode.POINTS, indices, attributes);
        }
        case SimplexMode_1.SimplexMode.EMPTY: {
            // It should be possible to no-op an EMPTY simplex.
            return new DrawPrimitive_1.DrawPrimitive(BeginMode_1.BeginMode.POINTS, indices, attributes);
        }
        default: {
            throw new Error("k => " + geometryMeta.k);
        }
    }
}
exports.simplicesToPrimitive = simplicesToPrimitive;
