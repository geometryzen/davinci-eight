var expectArg = require('../checks/expectArg');
var VectorN = require('../math/VectorN');
var DrawElements = (function () {
    function DrawElements(indices, attributes) {
        this.attributes = {};
        expectArg('indices', indices).toBeObject().toSatisfy(indices instanceof VectorN, "indices must be a VectorN<number>");
        expectArg('attributes', attributes).toBeObject();
        this.indices = indices;
        this.attributes = attributes;
    }
    return DrawElements;
})();
module.exports = DrawElements;
