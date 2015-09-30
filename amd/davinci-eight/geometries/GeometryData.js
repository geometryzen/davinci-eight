define(["require", "exports", '../checks/expectArg', '../math/VectorN'], function (require, exports, expectArg, VectorN) {
    /**
     * @class GeometryData
     */
    var GeometryData = (function () {
        /**
         * @class GeometryData
         * @constructor
         * @param k {number} <p>The dimensionality of the primitives.</p>
         * @param indices {VectorN} <p>A list of index into the attributes</p>
         * @param attributes {{[name:string]: GeometryAttribute}}
         */
        function GeometryData(k, indices, attributes) {
            // TODO: Looks like a DrawAttributeMap here (implementation only)
            /**
             * @property attributes
             * @type {{[name:string]: GeometryAttribute}}
             */
            this.attributes = {};
            expectArg('indices', indices).toBeObject().toSatisfy(indices instanceof VectorN, "indices must be a VectorN<number>");
            expectArg('attributes', attributes).toBeObject();
            this.k = k;
            this.indices = indices;
            this.attributes = attributes;
        }
        return GeometryData;
    })();
    return GeometryData;
});
