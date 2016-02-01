define(["require", "exports"], function (require, exports) {
    function default_1(a, b, c) {
        var a11 = a[0x0], a12 = a[0x2];
        var a21 = a[0x1], a22 = a[0x3];
        var b11 = b[0x0], b12 = b[0x2];
        var b21 = b[0x1], b22 = b[0x3];
        c[0x0] = a11 + b11;
        c[0x2] = a12 + b12;
        c[0x1] = a21 + b21;
        c[0x3] = a22 + b22;
        return c;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});
