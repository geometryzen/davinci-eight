define(["require", "exports", '../dfx/quad', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, quad, Symbolic, Vector2, Vector3) {
    function vector3(data) {
        return new Vector3([]);
    }
    // cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    //
    function cube(size) {
        if (size === void 0) { size = 1; }
        var s = size / 2;
        var vec0 = new Vector3([+s, +s, +s]);
        var vec1 = new Vector3([-s, +s, +s]);
        var vec2 = new Vector3([-s, -s, +s]);
        var vec3 = new Vector3([+s, -s, +s]);
        var vec4 = new Vector3([+s, -s, -s]);
        var vec5 = new Vector3([+s, +s, -s]);
        var vec6 = new Vector3([-s, +s, -s]);
        var vec7 = new Vector3([-s, -s, -s]);
        var c00 = new Vector2([0, 0]);
        var c01 = new Vector2([0, 1]);
        var c10 = new Vector2([1, 0]);
        var c11 = new Vector2([1, 1]);
        var attributes = {};
        attributes[Symbolic.ATTRIBUTE_TEXTURE] = [c11, c01, c00, c10];
        // We currently call quad rather than square because of the arguments.
        var front = quad(vec0, vec1, vec2, vec3, attributes);
        var right = quad(vec0, vec3, vec4, vec5, attributes);
        var top = quad(vec0, vec5, vec6, vec1, attributes);
        var left = quad(vec1, vec6, vec7, vec2, attributes);
        var bottom = quad(vec7, vec4, vec3, vec2, attributes);
        var back = quad(vec4, vec7, vec6, vec5, attributes);
        var squares = [front, right, top, left, bottom, back];
        return squares.reduce(function (a, b) { return a.concat(b); }, []);
    }
    return cube;
});
