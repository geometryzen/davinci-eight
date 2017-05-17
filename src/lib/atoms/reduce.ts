import { Attribute } from '../core/Attribute';
import { AttributeSizeType } from '../core/AttributeSizeType';
import { BeginMode } from '../core/BeginMode';
import { DataType } from '../core/DataType';
import { Primitive } from '../core/Primitive';

function copyIndices(src: Primitive, dest: number[], delta: number): void {
    if (src.indices) {
        const iLen = src.indices.length;
        for (let i = 0; i < iLen; i++) {
            dest.push(src.indices[i] + delta);
        }
    }
}

function max(xs: number[]): number {
    return xs.reduce(function (a, b) { return a > b ? a : b; });
}

function joinIndices(previous: Primitive, current: Primitive, dest: number[]): void {
    if (previous.indices) {
        const lastIndex = previous.indices[previous.indices.length - 1];
        if (current.indices) {
            const nextIndex = current.indices[0] + max(previous.indices) + 1;
            // Make this triangle degenerate.
            dest.push(lastIndex);
            // Join to the next triangle strip.
            dest.push(nextIndex);
        }
    }
}

function ensureAttribute(attributes: { [name: string]: Attribute }, name: string, size: AttributeSizeType, type: DataType): Attribute {
    if (!attributes[name]) {
        attributes[name] = { values: [], size, type };
    }
    return attributes[name];
}

function copyAttributes(primitive: Primitive, attributes: { [name: string]: Attribute }) {
    const keys = Object.keys(primitive.attributes);
    const kLen = keys.length;
    for (let k = 0; k < kLen; k++) {
        const key = keys[k];
        const srcAttrib = primitive.attributes[key];
        const dstAttrib = ensureAttribute(attributes, key, srcAttrib.size, srcAttrib.type);
        const svalues = srcAttrib.values;
        const vLen = svalues.length;
        for (let v = 0; v < vLen; v++) {
            dstAttrib.values.push(svalues[v]);
        }
    }
}

/**
 * reduces multiple TRIANGLE_STRIP Primitives to a single TRAINGLE_STRIP Primitive.
 */
export function reduce(primitives: Primitive[]): Primitive {
    for (let i = 0; i < primitives.length; i++) {
        const primitive = primitives[i];
        if (primitive.mode !== BeginMode.TRIANGLE_STRIP) {
            throw new Error(`mode (${primitive.mode}) must be TRIANGLE_STRIP`);
        }
    }
    return primitives.reduce(function (previous: Primitive, current: Primitive) {
        const indices: number[] = [];

        copyIndices(previous, indices, 0);
        joinIndices(previous, current, indices);
        copyIndices(current, indices, max(previous.indices) + 1);

        const attributes: { [name: string]: Attribute } = {};

        copyAttributes(previous, attributes);
        copyAttributes(current, attributes);

        return {
            mode: BeginMode.TRIANGLE_STRIP,
            indices,
            attributes
        };
    });
}
