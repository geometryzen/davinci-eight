define(["require", "exports"], function (require, exports) {
    function clamp(x, min, max) {
        return (x < min) ? min : ((x > max) ? max : x);
    }
    return clamp;
});
