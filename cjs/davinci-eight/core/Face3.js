var Vector3 = require('../math/Vector3');
var Face3 = (function () {
    function Face3(a, b, c, normal) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.normal = normal instanceof Vector3 ? normal : new Vector3();
        this.vertexNormals = normal instanceof Array ? normal : [];
    }
    return Face3;
})();
module.exports = Face3;
