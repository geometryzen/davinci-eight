var expectArg = require('../checks/expectArg');
var Matrix2 = (function () {
    /**
     * Constructs the Matrix4 by wrapping a Float32Array.
     * @constructor
     */
    function Matrix2(elements) {
        expectArg('elements', elements).toSatisfy(elements.length === 4, 'elements must have length 4');
        this.elements = elements;
    }
    return Matrix2;
})();
module.exports = Matrix2;
