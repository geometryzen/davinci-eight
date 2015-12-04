define(["require", "exports"], function (require, exports) {
    function isVectorN(values) {
        return true;
    }
    function checkValues(values) {
        if (!isVectorN(values)) {
            throw new Error("values must be a number[]");
        }
        return values;
    }
    function isExactMultipleOf(numer, denom) {
        return numer % denom === 0;
    }
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
     * @class DrawAttribute
     */
    var DrawAttribute = (function () {
        /**
         * A convenience class for constructing and validating attribute values used for drawing.
         * @class DrawAttribute
         * @constructor
         * @param values {number[]}
         * @param size {number}
         */
        function DrawAttribute(values, size) {
            // mustBeArray('values', values)
            // mustBeInteger('size', size)
            this.values = checkValues(values);
            this.size = checkSize(size, values);
        }
        return DrawAttribute;
    })();
    return DrawAttribute;
});
