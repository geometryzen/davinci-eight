define(["require", "exports", '../geometries/quadrilateral', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, quadrilateral, Symbolic, R2, R3) {
    function vector3(data) {
        return new R3([]);
    }
    /**
     * cube as Simplex[]
     *
     *    v6----- v5
     *   /|      /|
     *  v1------v0|
     *  | |     | |
     *  | |v7---|-|v4
     *  |/      |/
     *  v2------v3
     */
    function cube(size) {
        if (size === void 0) { size = 1; }
        var s = size / 2;
        var vec0 = new R3([+s, +s, +s]);
        var vec1 = new R3([-s, +s, +s]);
        var vec2 = new R3([-s, -s, +s]);
        var vec3 = new R3([+s, -s, +s]);
        var vec4 = new R3([+s, -s, -s]);
        var vec5 = new R3([+s, +s, -s]);
        var vec6 = new R3([-s, +s, -s]);
        var vec7 = new R3([-s, -s, -s]);
        var c00 = new R2([0, 0]);
        var c01 = new R2([0, 1]);
        var c10 = new R2([1, 0]);
        var c11 = new R2([1, 1]);
        var attributes = {};
        attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = [c11, c01, c00, c10];
        // We currently call quadrilateral rather than square because of the arguments.
        var front = quadrilateral(vec0, vec1, vec2, vec3, attributes);
        var right = quadrilateral(vec0, vec3, vec4, vec5, attributes);
        var top = quadrilateral(vec0, vec5, vec6, vec1, attributes);
        var left = quadrilateral(vec1, vec6, vec7, vec2, attributes);
        var bottom = quadrilateral(vec7, vec4, vec3, vec2, attributes);
        var back = quadrilateral(vec4, vec7, vec6, vec5, attributes);
        var squares = [front, right, top, left, bottom, back];
        // TODO: Fix up the opposing property so that the cube is fully linked together.
        return squares.reduce(function (a, b) { return a.concat(b); }, []);
    }
    return cube;
});
