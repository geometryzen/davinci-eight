var expectArg = require('../checks/expectArg');
var VectorN = require('../math/VectorN');
// The use of VectorN rather than number[] points to a possible reactive implementation.
// If the manager holds on to the Elements then with notifications we get dynamic updating?
// How can we get 2-way binding?
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
