import { Attribute } from '../core/Attribute';
import { AttributeSizeType } from '../core/AttributeSizeType';
import { DataType } from '../core/DataType';

/**
 * @hidden
 */
function isVectorN(values: number[]): boolean {
    return Array.isArray(values);
}

/**
 * @hidden
 */
function checkValues(values: number[]): number[] {
    if (!isVectorN(values)) {
        throw new Error("values must be a number[]");
    }
    return values;
}

/**
 * @hidden
 */
function isExactMultipleOf(numer: number, denom: number): boolean {
    return numer % denom === 0;
}

/**
 * @hidden
 */
function checkSize(size: AttributeSizeType, values: number[]): AttributeSizeType {
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
export class DrawAttribute implements Attribute {
    public readonly values: number[];
    public readonly size: AttributeSizeType;
    public readonly type: DataType;
    constructor(values: number[], size: AttributeSizeType, type: DataType) {
        // mustBeArray('values', values)
        // mustBeInteger('size', size)
        this.values = checkValues(values);
        this.size = checkSize(size, values);
        this.type = type;
    }
}
