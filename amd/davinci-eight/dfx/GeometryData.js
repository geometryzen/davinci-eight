define(["require", "exports", '../checks/expectArg', '../math/VectorN'], function (require, exports, expectArg, VectorN) {
    var GeometryData = (function () {
        function GeometryData(k, indices, attributes) {
            // TODO: Looks like a DrawAttributeMap here (implementation only)
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
