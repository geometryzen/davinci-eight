define(["require", "exports", '../math/R3', '../checks/mustSatisfy', '../checks/isDefined'], function (require, exports, R3_1, mustSatisfy_1, isDefined_1) {
    var n = new R3_1.default();
    var u = new R3_1.default();
    var v = new R3_1.default();
    function viewArray(eye, look, up, matrix) {
        var m = isDefined_1.default(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        mustSatisfy_1.default('matrix', m.length === 16, function () { return 'matrix must have length 16'; });
        n.copy(eye).sub(look);
        if (n.x === 0 && n.y === 0 && n.z === 0) {
            n.z = 1;
        }
        else {
            n.direction();
        }
        u.copy(up).cross(n);
        v.copy(n).cross(u);
        m[0x0] = u.x;
        m[0x4] = u.y;
        m[0x8] = u.z;
        m[0xC] = -R3_1.default.dot(eye, u);
        m[0x1] = v.x;
        m[0x5] = v.y;
        m[0x9] = v.z;
        m[0xD] = -R3_1.default.dot(eye, v);
        m[0x2] = n.x;
        m[0x6] = n.y;
        m[0xA] = n.z;
        m[0xE] = -R3_1.default.dot(eye, n);
        m[0x3] = 0;
        m[0x7] = 0;
        m[0xB] = 0;
        m[0xF] = 1;
        return m;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = viewArray;
});
