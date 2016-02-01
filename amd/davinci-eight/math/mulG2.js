define(["require", "exports", '../math/compG2Get', '../math/mulE2', '../math/compG2Set'], function (require, exports, compG2Get_1, mulE2_1, compG2Set_1) {
    function mulG3(a, b, out) {
        var a0 = compG2Get_1.default(a, 0);
        var a1 = compG2Get_1.default(a, 1);
        var a2 = compG2Get_1.default(a, 2);
        var a3 = compG2Get_1.default(a, 3);
        var b0 = compG2Get_1.default(b, 0);
        var b1 = compG2Get_1.default(b, 1);
        var b2 = compG2Get_1.default(b, 2);
        var b3 = compG2Get_1.default(b, 3);
        for (var i = 0; i < 4; i++) {
            compG2Set_1.default(out, i, mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, i));
        }
        return out;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mulG3;
});
