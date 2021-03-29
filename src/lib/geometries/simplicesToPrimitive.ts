import { DrawAttribute } from '../atoms/DrawAttribute';
import { DrawPrimitive } from '../atoms/DrawPrimitive';
import { VectorN } from '../atoms/VectorN';
import { Vertex } from '../atoms/Vertex';
import { expectArg } from '../checks/expectArg';
import { copyToArray } from '../collections/copyToArray';
import { Attribute } from '../core/Attribute';
import { AttributeSizeType } from '../core/AttributeSizeType';
import { BeginMode } from '../core/BeginMode';
import { DataType } from '../core/DataType';
import { Primitive } from '../core/Primitive';
import { VectorN as DefaultVectorN } from '../math/VectorN';
import { computeUniqueVertices } from './computeUniqueVertices';
import { dataFromVectorN } from './dataFromVectorN';
import { GeometryMeta } from './GeometryMeta';
import { Simplex } from './Simplex';
import { SimplexMode } from './SimplexMode';
import { simplicesToGeometryMeta } from './simplicesToGeometryMeta';

/**
 * @hidden
 */
function numberList(size: number, value: number): number[] {
    const data: number[] = [];
    for (let i = 0; i < size; i++) { data.push(value); }
    return data;
}

/**
 * @hidden
 */
function attribName(name: string, attribMap?: { [name: string]: { name?: string } }): string {
    expectArg('name', name).toBeString();
    expectArg('attribMap', attribMap).toBeObject();
    const meta = attribMap[name];
    if (meta) {
        const alias = meta.name;
        return alias ? alias : name;
    }
    else {
        throw new Error("Unable to compute name; missing attribute specification for " + name);
    }
}

/**
 * @hidden
 */
function attribSize(key: string, attribMap?: { [key: string]: { size: AttributeSizeType } }): AttributeSizeType {
    expectArg('key', key).toBeString();
    expectArg('attribMap', attribMap).toBeObject();
    const meta = attribMap[key];
    if (meta) {
        const size = meta.size;
        // TODO: Override the message...
        expectArg('size', size).toBeNumber();
        return meta.size;
    }
    else {
        throw new Error("Unable to compute size; missing attribute specification for " + key);
    }
}

/**
 * @hidden
 */
function concat(a: number[], b: number[]): number[] {
    return a.concat(b);
}

/**
 * @hidden
 */
export function simplicesToPrimitive(simplices: Simplex[], geometryMeta?: GeometryMeta): Primitive {
    expectArg('simplices', simplices).toBeObject();

    const actuals: GeometryMeta = simplicesToGeometryMeta(simplices);

    if (geometryMeta) {
        expectArg('geometryMeta', geometryMeta).toBeObject();
    }
    else {
        geometryMeta = actuals;
    }

    const attribMap = geometryMeta.attributes;

    // Cache the keys and keys.length of the specified attributes and declare a loop index.
    const keys = Object.keys(attribMap);
    const keysLen = keys.length;

    // Side effect is to set the index property, but it will be be the same as the array index. 
    const vertices: Vertex[] = computeUniqueVertices(simplices);
    const vsLength = vertices.length;
    // Each simplex produces as many indices as vertices.
    // This is why we need the Vertex to have an temporary index property.
    const indices: number[] = simplices.map(Simplex.indices).reduce(concat, []);

    // Create intermediate data structures for output and to cache dimensions and name.
    // For performance an array will be used whose index is the key index.
    const outputs: { data: number[]; dimensions: AttributeSizeType; name: string }[] = [];
    for (let k = 0; k < keysLen; k++) {
        const key = keys[k];
        const dims = attribSize(key, attribMap);
        const data = numberList(vsLength * dims, void 0);
        outputs.push({ data: data, dimensions: dims, name: attribName(key, attribMap) });
    }

    // Accumulate attribute data in intermediate data structures.
    for (let i = 0; i < vsLength; i++) {
        const vertex = vertices[i];
        const vertexAttribs = vertex.attributes;
        if (vertex.index !== i) {
            expectArg('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
        }
        for (let k = 0; k < keysLen; k++) {
            const output = outputs[k];
            const size = output.dimensions;
            let value: VectorN<number> = vertexAttribs[keys[k]];
            if (!value) {
                value = new DefaultVectorN<number>(numberList(size, 0), false, size);
            }
            // TODO: Merge functions to avoid creating temporary array.
            const data: number[] = dataFromVectorN(value);
            copyToArray(data, output.data, i * output.dimensions);
        }
    }

    // Copy accumulated attribute arrays to output data structure.
    const attributes: { [name: string]: Attribute } = {};
    for (let k = 0; k < keysLen; k++) {
        const output = outputs[k];
        const data = output.data;
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
