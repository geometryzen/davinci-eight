/**
 * @hidden
 */
function isVectorN(values) {
    return Array.isArray(values);
}
/**
 * @hidden
 */
function checkValues(values) {
    if (!isVectorN(values)) {
        throw new Error("values must be a number[]");
    }
    return values;
}
/**
 * @hidden
 */
function isExactMultipleOf(numer, denom) {
    return numer % denom === 0;
}
/**
 * @hidden
 */
function checkSize(size, values) {
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
 * @hidden
 */
var DrawAttribute = /** @class */ (function () {
    function DrawAttribute(values, size, type) {
        // mustBeArray('values', values)
        // mustBeInteger('size', size)
        this.values = checkValues(values);
        this.size = checkSize(size, values);
        this.type = type;
    }
    return DrawAttribute;
}());
export { DrawAttribute };
