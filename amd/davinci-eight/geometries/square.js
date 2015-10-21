define(["require", "exports", '../geometries/quadrilateral', '../core/Symbolic', '../math/MutableVectorE2', '../math/MutableVectorE3'], function (require, exports, quadrilateral, Symbolic, MutableVectorE2, MutableVectorE3) {
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
        var vec0 = new MutableVectorE3([+s, +s, 0]);
        var vec1 = new MutableVectorE3([-s, +s, 0]);
        var vec2 = new MutableVectorE3([-s, -s, 0]);
        var vec3 = new MutableVectorE3([+s, -s, 0]);
        var c00 = new MutableVectorE2([0, 0]);
        var c01 = new MutableVectorE2([0, 1]);
        var c10 = new MutableVectorE2([1, 0]);
        var c11 = new MutableVectorE2([1, 1]);
        var coords = [c11, c01, c00, c10];
        var attributes = {};
        attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = coords;
        return quadrilateral(vec0, vec1, vec2, vec3, attributes);
    }
    return square;
});
