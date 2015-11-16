import mustBeArray = require('../checks/mustBeArray')
import mustBeInteger = require('../checks/mustBeInteger')

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

function checkSize(chunkSize: number, values: number[]): number {
    if (typeof chunkSize === 'number') {
        if (!isExactMultipleOf(values.length, chunkSize)) {
            throw new Error("values.length must be an exact multiple of chunkSize")
        }
    }
    else {
        throw new Error("chunkSize must be a number")
    }
    return chunkSize
}

/**
 * @class DrawAttribute
 */
class DrawAttribute {
    /**
     * The values of the attribute.
     * @property values
     * @type {number[]}
     */
    public values: number[];
    /**
     * The chunking chunkSize of the attribute.
     * The chunking chunkSize is invariant given the values and is used to describe the vertex attribute pointer.
     * @property chunkSize
     * @type {number}
     */
    public chunkSize: number;
    /**
     * @class DrawAttribute
     * @constructor
     * @param values {number[]}
     * @param chunkSize {number}
     */
    constructor(values: number[], chunkSize: number) {
        // mustBeArray('values', values)
        // mustBeInteger('chunkSize', chunkSize)
        this.values = checkValues(values)
        this.chunkSize = checkSize(chunkSize, values)
    }
}
export = DrawAttribute;