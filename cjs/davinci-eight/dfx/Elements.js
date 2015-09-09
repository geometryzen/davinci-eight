var expectArg = require('../checks/expectArg');
var Elements = (function () {
    function Elements(indices, attributes) {
        this.attributes = {};
        expectArg('indices', indices).toBeObject();
        expectArg('attributes', attributes).toBeObject();
        this.indices = indices;
        this.attributes = attributes;
    }
    return Elements;
})();
module.exports = Elements;
