define(["require", "exports"], function (require, exports) {
    function randumbInteger() {
        var r = Math.random();
        var s = r * 1000000;
        var i = Math.round(s);
        return i;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = randumbInteger;
});
