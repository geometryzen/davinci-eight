var expectArg = require('../checks/expectArg');
var VectorN = require('../math/VectorN');
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
module.exports = Elements;
