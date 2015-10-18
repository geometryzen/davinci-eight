import DrawMode = require('../core/DrawMode')
import toGeometryMeta = require('../geometries/toGeometryMeta');
import computeUniqueVertices = require('../geometries/computeUniqueVertices');
import GeometryElements = require('../geometries/GeometryElements');
import GeometryAttribute = require('../geometries/GeometryAttribute');
import expectArg = require('../checks/expectArg');
import GeometryMeta = require('../geometries/GeometryMeta');
import Simplex = require('../geometries/Simplex');
import VectorN = require('../math/VectorN');
import Vertex = require('../geometries/Vertex');

function numberList(size: number, value: number): number[] {
    let data: number[] = [];
    for (var i = 0; i < size; i++) { data.push(value); }
    return data;
}

function attribName(name: string, attribMap?: { [name: string]: { name?: string } }): string {
    expectArg('name', name).toBeString();
    expectArg('attribMap', attribMap).toBeObject();
    let meta = attribMap[name];
    if (meta) {
        let alias = meta.name;
        return alias ? alias : name;
    }
    else {
        throw new Error("Unable to compute name; missing attribute specification for " + name);
    }
}

function attribSize(key: string, attribMap?: { [key: string]: { size: number } }): number {
    expectArg('key', key).toBeString();
    expectArg('attribMap', attribMap).toBeObject();
    let meta = attribMap[key];
    if (meta) {
        let size = meta.size;
        // TODO: Override the message...
        expectArg('size', size).toBeNumber();
        return meta.size;
    }
    else {
        throw new Error("Unable to compute size; missing attribute specification for " + key);
    }
}

function concat(a: number[], b: number[]): number[] {
    return a.concat(b);
}

function toGeometryData(simplices: Simplex[], geometryMeta?: GeometryMeta): GeometryElements {
    expectArg('simplices', simplices).toBeObject()

    var actuals: GeometryMeta = toGeometryMeta(simplices);

    if (geometryMeta) {
        expectArg('geometryMeta', geometryMeta).toBeObject();
    }
    else {
        geometryMeta = actuals;
    }

    let attribMap = geometryMeta.attributes;

    // Cache the keys and keys.length of the specified attributes and declare a loop index.
    let keys = Object.keys(attribMap);
    let keysLen = keys.length;
    var k: number;

    // Side effect is to set the index property, but it will be be the same as the array index. 
    let vertices: Vertex[] = computeUniqueVertices(simplices);
    let vsLength = vertices.length;
    var i: number;
    // Each simplex produces as many indices as vertices.
    // This is why we need the Vertex to have an temporary index property.
    let indices: number[] = simplices.map(Simplex.indices).reduce(concat, []);

    // Create intermediate data structures for output and to cache dimensions and name.
    // For performance an array will be used whose index is the key index.
    let outputs: { data: number[]; dimensions: number; name: string }[] = [];
    for (k = 0; k < keysLen; k++) {
        let key = keys[k];
        let dims = attribSize(key, attribMap);
        let data = numberList(vsLength * dims, void 0);
        outputs.push({ data: data, dimensions: dims, name: attribName(key, attribMap) });
    }

    // Accumulate attribute data in intermediate data structures.
    for (i = 0; i < vsLength; i++) {
        let vertex = vertices[i]
        let vertexAttribs = vertex.attributes;
        if (vertex.index !== i) {
            expectArg('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
        }
        for (k = 0; k < keysLen; k++) {
            let output = outputs[k]
            let size = output.dimensions
            let data: VectorN<number> = vertexAttribs[keys[k]]
            if (!data) {
                data = new VectorN<number>(numberList(size, 0), false, size)
            }
            data.toArray(output.data, i * output.dimensions)
        }
    }

    // Copy accumulated attribute arrays to output data structure.
    var attributes: { [name: string]: GeometryAttribute } = {};
    for (k = 0; k < keysLen; k++) {
        let output = outputs[k]
        let data = output.data
        attributes[output.name] = new GeometryAttribute(data, output.dimensions)
    }
    switch (geometryMeta.k) {
        case Simplex.TRIANGLE: {
            return new GeometryElements(DrawMode.TRIANGLES, indices, attributes)
        }
        case Simplex.LINE: {
            return new GeometryElements(DrawMode.LINES, indices, attributes)
        }
        case Simplex.POINT: {
            return new GeometryElements(DrawMode.POINTS, indices, attributes)
        }
        case Simplex.EMPTY: {
            // It should be possible to no-op render an EMPTY simplex.
            return new GeometryElements(DrawMode.POINTS, indices, attributes)
        }
        default: {
            throw new Error("k => " + geometryMeta.k)
        }
    }
}

export = toGeometryData