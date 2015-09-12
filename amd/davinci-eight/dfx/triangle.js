define(["require", "exports", '../dfx/computeFaceNormals', '../checks/expectArg', '../dfx/Simplex'], function (require, exports, computeFaceNormals, expectArg, Simplex) {
    function triangle(a, b, c, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg('a', a).toBeObject();
        expectArg('b', b).toBeObject();
        expectArg('b', c).toBeObject();
        var simplex = new Simplex([a, b, c]);
        computeFaceNormals(simplex);
        Simplex.setAttributeValues(attributes, simplex);
        triangles.push(simplex);
        return triangles;
    }
    return triangle;
});
