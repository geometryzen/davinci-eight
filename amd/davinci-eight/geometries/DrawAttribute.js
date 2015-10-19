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
    function checkSize(chunkSize, values) {
        if (typeof chunkSize === 'number') {
            if (!isExactMultipleOf(values.length, chunkSize)) {
                throw new Error("values.length must be an exact multiple of chunkSize");
            }
        }
        else {
            throw new Error("chunkSize must be a number");
        }
        return chunkSize;
    }
    /**
     * @class DrawAttribute
     */
    var DrawAttribute = (function () {
        /**
         * @class DrawAttribute
         * @constructor
         * @param values {number[]}
         * @param chunkSize {number}
         */
        function DrawAttribute(values, chunkSize) {
            // mustBeArray('values', values)
            // mustBeInteger('chunkSize', chunkSize)
            this.values = checkValues(values);
            this.chunkSize = checkSize(chunkSize, values);
        }
        return DrawAttribute;
    })();
    return DrawAttribute;
});
