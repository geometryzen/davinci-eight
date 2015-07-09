define(["require", "exports"], function (require, exports) {
    function clamp(x, a, b) {
        return (x < a) ? a : ((x > b) ? b : x);
    }
    return clamp;
});
