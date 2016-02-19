define(["require", "exports", '../core/GraphicsProgramSymbols', '../math/Vector3', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, GraphicsProgramSymbols_1, Vector3_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    function computeFaceNormals(simplex, positionName, normalName) {
        if (positionName === void 0) { positionName = GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION; }
        if (normalName === void 0) { normalName = GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL; }
        var vertex0 = simplex.vertices[0].attributes;
        var vertex1 = simplex.vertices[1].attributes;
        var vertex2 = simplex.vertices[2].attributes;
        var pos0 = vertex0[positionName];
        var pos1 = vertex1[positionName];
        var pos2 = vertex2[positionName];
        var x0 = pos0.getComponent(0);
        var y0 = pos0.getComponent(1);
        var z0 = pos0.getComponent(2);
        var x1 = pos1.getComponent(0);
        var y1 = pos1.getComponent(1);
        var z1 = pos1.getComponent(2);
        var x2 = pos2.getComponent(0);
        var y2 = pos2.getComponent(1);
        var z2 = pos2.getComponent(2);
        var ax = x2 - x1;
        var ay = y2 - y1;
        var az = z2 - z1;
        var bx = x0 - x1;
        var by = y0 - y1;
        var bz = z0 - z1;
        var x = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
        var y = wedgeZX_1.default(ax, ay, az, bx, by, bz);
        var z = wedgeXY_1.default(ax, ay, az, bx, by, bz);
        var normal = new Vector3_1.default([x, y, z]).direction();
        vertex0[normalName] = normal;
        vertex1[normalName] = normal;
        vertex2[normalName] = normal;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = computeFaceNormals;
});
