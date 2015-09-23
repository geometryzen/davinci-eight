define(["require", "exports"], function (require, exports) {
    /**
     * Initially used to give me a canvasId.
     * Using the big-enough space principle to avoid collisions.
     */
    function randumbInteger() {
        var r = Math.random();
        var s = r * 1000000;
        var i = Math.round(s);
        return i;
    }
    return randumbInteger;
});
