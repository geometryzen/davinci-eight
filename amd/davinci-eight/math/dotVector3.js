define(["require", "exports"], function (require, exports) {
    function dotVector3(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    return dotVector3;
});
