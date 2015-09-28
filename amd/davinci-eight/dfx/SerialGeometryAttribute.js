define(["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    function isVectorN(values) {
        return values instanceof VectorN;
    }
    function checkValues(values) {
        if (!isVectorN(values)) {
            throw new Error("values must be a VectorN");
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
     * <p>
     * Holds all the values of a particular attribute.
     * The size property describes how to break up the values.
     * The length of the values should be an integer multiple of the size.
     * </p>
    
      var x = 3;
    
     * @class SerialGeometryAttribute
     */
    var SerialGeometryAttribute = (function () {
        /**
         * @class SerialGeometryAttribute
         * @constructor
         * @param values {VectorN<number>}
         * @param size {number}
         */
        function SerialGeometryAttribute(values, size) {
            this.values = checkValues(values);
            this.size = checkSize(size, values);
        }
        return SerialGeometryAttribute;
    })();
    return SerialGeometryAttribute;
});
