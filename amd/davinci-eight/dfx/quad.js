define(["require", "exports", '../checks/expectArg', '../dfx/triangle', '../math/VectorN'], function (require, exports, expectArg, triangle, VectorN) {
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
    // quad
    //
    //  b-------a
    //  |       | 
    //  |       |
    //  |       |
    //  c-------d
    //
    function quad(a, b, c, d, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        expectArg('b', b).toSatisfy(b instanceof VectorN, "b must be a VectorN");
        expectArg('c', c).toSatisfy(c instanceof VectorN, "c must be a VectorN");
        expectArg('d', d).toSatisfy(d instanceof VectorN, "d must be a VectorN");
        var triatts = {};
        setAttributes([0, 1, 2], attributes, triatts);
        triangle(a, b, c, triatts, triangles);
        setAttributes([0, 2, 3], attributes, triatts);
        // For symmetry this would be nice to be c-d-a and 2-3-0
        triangle(a, c, d, triatts, triangles);
        return triangles;
    }
    return quad;
});
