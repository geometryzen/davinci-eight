define(["require", "exports", '../checks/expectArg', '../math/VectorN'], function (require, exports, expectArg, VectorN) {
    var Elements = (function () {
        function Elements(indices, attributes) {
            this.attributes = {};
            expectArg('indices', indices).toBeObject().toSatisfy(indices instanceof VectorN, "indices must be a VectorN<number>");
            expectArg('attributes', attributes).toBeObject();
            this.indices = indices;
            this.attributes = attributes;
        }
        return Elements;
    })();
    return Elements;
});
