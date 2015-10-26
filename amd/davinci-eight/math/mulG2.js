define(["require", "exports", '../math/compG2Get', '../math/mulE2', '../math/compG2Set'], function (require, exports, get, mulE2, set) {
    function mulG3(a, b, out) {
        var a0 = get(a, 0);
        var a1 = get(a, 1);
        var a2 = get(a, 2);
        var a3 = get(a, 3);
        var b0 = get(b, 0);
        var b1 = get(b, 1);
        var b2 = get(b, 2);
        var b3 = get(b, 3);
        for (var i = 0; i < 4; i++) {
            set(out, i, mulE2(a0, a1, a2, a3, b0, b1, b2, b3, i));
        }
        return out;
    }
    return mulG3;
});
