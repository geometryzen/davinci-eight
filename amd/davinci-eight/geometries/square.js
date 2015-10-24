define(["require", "exports", '../geometries/quadrilateral', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, quadrilateral, Symbolic, R2, R3) {
    // square
    //
    //  b-------a
    //  |       | 
    //  |       |
    //  |       |
    //  c-------d
    //
    function square(size) {
        if (size === void 0) { size = 1; }
        var s = size / 2;
        var vec0 = new R3([+s, +s, 0]);
        var vec1 = new R3([-s, +s, 0]);
        var vec2 = new R3([-s, -s, 0]);
        var vec3 = new R3([+s, -s, 0]);
        var c00 = new R2([0, 0]);
        var c01 = new R2([0, 1]);
        var c10 = new R2([1, 0]);
        var c11 = new R2([1, 1]);
        var coords = [c11, c01, c00, c10];
        var attributes = {};
        attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = coords;
        return quadrilateral(vec0, vec1, vec2, vec3, attributes);
    }
    return square;
});
