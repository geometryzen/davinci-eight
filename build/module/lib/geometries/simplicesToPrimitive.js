import { copyToArray } from '../collections/copyToArray';
import { dataFromVectorN } from './dataFromVectorN';
import { DataType } from '../core/DataType';
import { VectorN as DefaultVectorN } from '../math/VectorN';
import { DrawAttribute } from '../atoms/DrawAttribute';
import { BeginMode } from '../core/BeginMode';
import { DrawPrimitive } from '../atoms/DrawPrimitive';
import { simplicesToGeometryMeta } from './simplicesToGeometryMeta';
import { computeUniqueVertices } from './computeUniqueVertices';
import { expectArg } from '../checks/expectArg';
import { Simplex } from './Simplex';
import { SimplexMode } from './SimplexMode';
function numberList(size, value) {
    var data = [];
    for (var i = 0; i < size; i++) {
        data.push(value);
    }
    return data;
}
function attribName(name, attribMap) {
    expectArg('name', name).toBeString();
    expectArg('attribMap', attribMap).toBeObject();
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
    expectArg('key', key).toBeString();
    expectArg('attribMap', attribMap).toBeObject();
    var meta = attribMap[key];
    if (meta) {
        var size = meta.size;
        // TODO: Override the message...
        expectArg('size', size).toBeNumber();
        return meta.size;
    }
    else {
        throw new Error("Unable to compute size; missing attribute specification for " + key);
    }
}
function concat(a, b) {
    return a.concat(b);
}
export function simplicesToPrimitive(simplices, geometryMeta) {
    expectArg('simplices', simplices).toBeObject();
    var actuals = simplicesToGeometryMeta(simplices);
    if (geometryMeta) {
        expectArg('geometryMeta', geometryMeta).toBeObject();
    }
    else {
        geometryMeta = actuals;
    }
    var attribMap = geometryMeta.attributes;
    // Cache the keys and keys.length of the specified attributes and declare a loop index.
    var keys = Object.keys(attribMap);
    var keysLen = keys.length;
    // Side effect is to set the index property, but it will be be the same as the array index. 
    var vertices = computeUniqueVertices(simplices);
    var vsLength = vertices.length;
    // Each simplex produces as many indices as vertices.
    // This is why we need the Vertex to have an temporary index property.
    var indices = simplices.map(Simplex.indices).reduce(concat, []);
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
            expectArg('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
        }
        for (var k = 0; k < keysLen; k++) {
            var output = outputs[k];
            var size = output.dimensions;
            var value = vertexAttribs[keys[k]];
            if (!value) {
                value = new DefaultVectorN(numberList(size, 0), false, size);
            }
            // TODO: Merge functions to avoid creating temporary array.
            var data = dataFromVectorN(value);
            copyToArray(data, output.data, i * output.dimensions);
        }
    }
    // Copy accumulated attribute arrays to output data structure.
    var attributes = {};
    for (var k = 0; k < keysLen; k++) {
        var output = outputs[k];
        var data = output.data;
        attributes[output.name] = new DrawAttribute(data, output.dimensions, DataType.FLOAT);
    }
    switch (geometryMeta.k) {
        case SimplexMode.TRIANGLE: {
            return new DrawPrimitive(BeginMode.TRIANGLES, indices, attributes);
        }
        case SimplexMode.LINE: {
            return new DrawPrimitive(BeginMode.LINES, indices, attributes);
        }
        case SimplexMode.POINT: {
            return new DrawPrimitive(BeginMode.POINTS, indices, attributes);
        }
        case SimplexMode.EMPTY: {
            // It should be possible to no-op an EMPTY simplex.
            return new DrawPrimitive(BeginMode.POINTS, indices, attributes);
        }
        default: {
            throw new Error("k => " + geometryMeta.k);
        }
    }
}
