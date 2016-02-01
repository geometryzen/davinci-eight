define(["require", "exports", '../checks/expectArg', '../geometries/triangle', '../math/VectorN'], function (require, exports, expectArg_1, triangle_1, VectorN_1) {
    function tetrahedron(a, b, c, d, attributes, triangles) {
        if (attributes === void 0) { attributes = {}; }
        if (triangles === void 0) { triangles = []; }
        expectArg_1.default('a', a).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
        expectArg_1.default('b', b).toSatisfy(b instanceof VectorN_1.default, "b must be a VectorN");
        expectArg_1.default('c', c).toSatisfy(c instanceof VectorN_1.default, "c must be a VectorN");
        expectArg_1.default('d', d).toSatisfy(d instanceof VectorN_1.default, "d must be a VectorN");
        var triatts = {};
        var points = [a, b, c, d];
        var faces = [];
        triangle_1.default(points[0], points[1], points[2], triatts, triangles);
        faces.push(triangles[triangles.length - 1]);
        triangle_1.default(points[1], points[3], points[2], triatts, triangles);
        faces.push(triangles[triangles.length - 1]);
        triangle_1.default(points[2], points[3], points[0], triatts, triangles);
        faces.push(triangles[triangles.length - 1]);
        triangle_1.default(points[3], points[1], points[0], triatts, triangles);
        faces.push(triangles[triangles.length - 1]);
        return triangles;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = tetrahedron;
});
