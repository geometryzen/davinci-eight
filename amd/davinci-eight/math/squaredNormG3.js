define(["require", "exports"], function (require, exports) {
    function squaredNormG3(m) {
        var w = m.α;
        var x = m.x;
        var y = m.y;
        var z = m.z;
        var yz = m.yz;
        var zx = m.zx;
        var xy = m.xy;
        var v = m.β;
        return w * w + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + v * v;
    }
    return squaredNormG3;
});
