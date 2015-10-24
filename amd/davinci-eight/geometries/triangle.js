define(["require", "exports", '../geometries/computeFaceNormals', '../checks/expectArg', '../geometries/Simplex', '../core/Symbolic', '../math/VectorN'], function (require, exports, computeFaceNormals, expectArg, Simplex, Symbolic, VectorN) {
    function triangle(a, b, c, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        expectArg('b', b).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        expectArg('b', c).toSatisfy(a instanceof VectorN, "a must be a VectorN");
        var simplex = new Simplex(Simplex.TRIANGLE);
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = a;
        // simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.e1
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = b;
        // simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.e2
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = c;
        // simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.e3
        computeFaceNormals(simplex, Symbolic.ATTRIBUTE_POSITION, Symbolic.ATTRIBUTE_NORMAL);
        Simplex.setAttributeValues(attributes, simplex);
        triangles.push(simplex);
        return triangles;
    }
    return triangle;
});
