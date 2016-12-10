import Attribute from '../core/Attribute';
import DataType from '../core/DataType';

function isVectorN(values: number[]): boolean {
    return true;
}

function checkValues(values: number[]): number[] {
    if (!isVectorN(values)) {
        throw new Error("values must be a number[]");
    }
    return values;
}

function isExactMultipleOf(numer: number, denom: number): boolean {
    return numer % denom === 0;
}

function checkSize(size: 1 | 2 | 3 | 4, values: number[]): 1 | 2 | 3 | 4 {
    if (typeof size === 'number') {
        if (!isExactMultipleOf(values.length, size)) {
            throw new Error("values.length must be an exact multiple of size");
        }
    }
    else {
        throw new Error("size must be a number");
    }
    return size;
}

/**
 * A convenience class for implementing the Attribute interface.
 */
export default class DrawAttribute implements Attribute {
    public values: number[];
    public size: 1 | 2 | 3 | 4;
    public type: DataType;
    constructor(values: number[], size: 1 | 2 | 3 | 4, type: DataType) {
        // mustBeArray('values', values)
        // mustBeInteger('size', size)
        this.values = checkValues(values);
        this.size = checkSize(size, values);
        this.type = type;
    }
}
