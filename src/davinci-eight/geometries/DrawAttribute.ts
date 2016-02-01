import Attribute from '../geometries/Attribute';
import mustBeArray from '../checks/mustBeArray';
import mustBeInteger from '../checks/mustBeInteger';

function isVectorN(values: number[]): boolean {
    return true
}

function checkValues(values: number[]): number[] {
    if (!isVectorN(values)) {
        throw new Error("values must be a number[]")
    }
    return values
}

function isExactMultipleOf(numer: number, denom: number): boolean {
    return numer % denom === 0
}

function checkSize(size: number, values: number[]): number {
    if (typeof size === 'number') {
        if (!isExactMultipleOf(values.length, size)) {
            throw new Error("values.length must be an exact multiple of size")
        }
    }
    else {
        throw new Error("size must be a number")
    }
    return size
}

/**
 * @class DrawAttribute
 */
export default class DrawAttribute implements Attribute {
    /**
     * The values of the attribute.
     * @property values
     * @type {number[]}
     */
    public values: number[];

    /**
     * The chunking size of the attribute.
     * The chunking size is invariant given the values and is used to describe the vertex attribute pointer.
     * @property size
     * @type {number}
     */
    public size: number;

    /**
     * A convenience class for constructing and validating attribute values used for drawing.
     * @class DrawAttribute
     * @constructor
     * @param values {number[]}
     * @param size {number}
     */
    constructor(values: number[], size: number) {
        // mustBeArray('values', values)
        // mustBeInteger('size', size)
        this.values = checkValues(values)
        this.size = checkSize(size, values)
    }
}
