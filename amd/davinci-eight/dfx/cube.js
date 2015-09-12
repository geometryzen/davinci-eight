define(["require", "exports", '../dfx/quad', '../math/Vector2', '../math/Vector3'], function (require, exports, quad, Vector2, Vector3) {
    // cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    //
    function cube() {
        var vec0 = new Vector3([+1, +1, +1]);
        var vec1 = new Vector3([-1, +1, +1]);
        var vec2 = new Vector3([-1, -1, +1]);
        var vec3 = new Vector3([+1, -1, +1]);
        var vec4 = new Vector3([+1, -1, -1]);
        var vec5 = new Vector3([+1, +1, -1]);
        var vec6 = new Vector3([-1, +1, -1]);
        var vec7 = new Vector3([-1, -1, -1]);
        var c00 = new Vector2([0, 0]);
        var c01 = new Vector2([0, 1]);
        var c10 = new Vector2([1, 0]);
        var c11 = new Vector2([1, 1]);
        var coords = [c11, c01, c00, c10];
        var front = quad([vec0, vec1, vec2, vec3], coords);
        var right = quad([vec0, vec3, vec4, vec5], coords);
        var top = quad([vec0, vec5, vec6, vec1], coords);
        var left = quad([vec1, vec6, vec7, vec2], coords);
        var bottom = quad([vec7, vec4, vec3, vec2], coords);
        var back = quad([vec4, vec7, vec6, vec5], coords);
        var squares = [front, right, top, left, bottom, back];
        return squares.reduce(function (a, b) { return a.concat(b); }, []);
    }
    return cube;
});
