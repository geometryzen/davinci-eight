define(["require", "exports"], function (require, exports) {
    function quaditude3(vector) {
        var x = vector.x;
        var y = vector.y;
        var z = vector.z;
        return x * x + y * y + z * z;
    }
    return quaditude3;
});
