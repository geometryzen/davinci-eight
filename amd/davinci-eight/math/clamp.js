define(["require", "exports", '../checks/mustBeNumber'], function (require, exports, mustBeNumber) {
    function clamp(x, min, max) {
        mustBeNumber('x', x);
        mustBeNumber('min', min);
        mustBeNumber('max', max);
        return (x < min) ? min : ((x > max) ? max : x);
    }
    return clamp;
});
