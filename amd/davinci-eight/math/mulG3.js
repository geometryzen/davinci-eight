define(["require", "exports", '../math/compG3Get', '../math/mulE3'], function (require, exports, compG3Get_1, mulE3_1) {
    function default_1(a, b, out) {
        var a0 = a.α;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.z;
        var a4 = a.xy;
        var a5 = a.yz;
        var a6 = a.zx;
        var a7 = a.β;
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        var iLen = out.length;
        for (var i = 0; i < iLen; i++) {
            out[i] = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});
