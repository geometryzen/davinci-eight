define(["require", "exports"], function (require, exports) {
    function isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }
    return isArray;
});
