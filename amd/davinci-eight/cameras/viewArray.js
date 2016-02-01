define(["require", "exports", '../math/R3', '../checks/expectArg', '../checks/isDefined'], function (require, exports, R3_1, expectArg_1, isDefined_1) {
    function viewArray(eye, look, up, matrix) {
        var m = isDefined_1.default(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expectArg_1.default('matrix', m).toSatisfy(m.length === 16, 'matrix must have length 16');
        var n = new R3_1.default().sub2(eye, look);
        if (n.x === 0 && n.y === 0 && n.z === 0) {
            n.z = 1;
        }
        else {
            n.direction();
        }
        var u = new R3_1.default().cross2(up, n);
        var v = new R3_1.default().cross2(n, u);
        var d = new R3_1.default([R3_1.default.dot(eye, u), R3_1.default.dot(eye, v), R3_1.default.dot(eye, n)]).scale(-1);
        m[0] = u.x;
        m[4] = u.y;
        m[8] = u.z;
        m[12] = d.x;
        m[1] = v.x;
        m[5] = v.y;
        m[9] = v.z;
        m[13] = d.y;
        m[2] = n.x;
        m[6] = n.y;
        m[10] = n.z;
        m[14] = d.z;
        m[3] = 0;
        m[7] = 0;
        m[11] = 0;
        m[15] = 1;
        return m;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = viewArray;
});
