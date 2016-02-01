define(["require", "exports", '../geometries/computeFaceNormals', '../checks/expectArg', '../geometries/Simplex', '../core/GraphicsProgramSymbols', '../math/VectorN'], function (require, exports, computeFaceNormals_1, expectArg_1, Simplex_1, GraphicsProgramSymbols_1, VectorN_1) {
    function triangle(a, b, c, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg_1.default('a', a).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
        expectArg_1.default('b', b).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
        expectArg_1.default('b', c).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
        var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = a;
        simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = b;
        simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = c;
        computeFaceNormals_1.default(simplex, GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL);
        Simplex_1.default.setAttributeValues(attributes, simplex);
        triangles.push(simplex);
        return triangles;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = triangle;
});
