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
 * <p>
 * Holds all the values of a particular attribute.
 * The size property describes how to break up the values.
 * The length of the values should be an integer multiple of the size.
 * </p>

  var x = 3;

 * @class GeometryAttribute
 */
class GeometryAttribute {
    /**
     * The values of the attribute.
     * @property values
     * @type {number[]}
     */
    public values: number[];
    /**
     * The chunking size of the attribute.
     * This is distinct from the size in the `GeometryMeta`.
     * The chunking size is invariant given the values and is used to describe the vertex attribute pointer.
     * @property size
     * @type {number}
     */
    // FIXME: rename to chunkSize.
    public size: number;
    /**
     * @class GeometryAttribute
     * @constructor
     * @param values {number[]}
     * @param size {number}
     */
    constructor(values: number[], size: number) {
        this.values = checkValues(values)
        this.size = checkSize(size, values)
    }
}
export = GeometryAttribute;