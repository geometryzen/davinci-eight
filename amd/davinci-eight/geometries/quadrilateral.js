define(["require", "exports", '../checks/expectArg', '../geometries/triangle', '../math/VectorN'], function (require, exports, expectArg_1, triangle_1, VectorN_1) {
    function setAttributes(which, source, target) {
        var names = Object.keys(source);
        var namesLength = names.length;
        var i;
        var name;
        var values;
        for (i = 0; i < namesLength; i++) {
            name = names[i];
            values = source[name];
            target[name] = which.map(function (index) { return values[index]; });
        }
    }
    function quadrilateral(a, b, c, d, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg_1.default('a', a).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
        expectArg_1.default('b', b).toSatisfy(b instanceof VectorN_1.default, "b must be a VectorN");
        expectArg_1.default('c', c).toSatisfy(c instanceof VectorN_1.default, "c must be a VectorN");
        expectArg_1.default('d', d).toSatisfy(d instanceof VectorN_1.default, "d must be a VectorN");
        var triatts = {};
        setAttributes([1, 2, 0], attributes, triatts);
        triangle_1.default(b, c, a, triatts, triangles);
        setAttributes([3, 0, 2], attributes, triatts);
        triangle_1.default(d, a, c, triatts, triangles);
        return triangles;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = quadrilateral;
});
