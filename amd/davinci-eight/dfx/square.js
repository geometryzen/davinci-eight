define(["require", "exports", '../dfx/quad', '../math/Vector2', '../math/Vector3'], function (require, exports, quad, Vector2, Vector3) {
    // square
    //  v1------v0
    //  |       | 
    //  |       |
    //  |       |
    //  v2------v3
    //
    function square() {
        var vec0 = new Vector3([+1, +1, 0]);
        var vec1 = new Vector3([-1, +1, 0]);
        var vec2 = new Vector3([-1, -1, 0]);
        var vec3 = new Vector3([+1, -1, 0]);
        var c00 = new Vector2([0, 0]);
        var c01 = new Vector2([0, 1]);
        var c10 = new Vector2([1, 0]);
        var c11 = new Vector2([1, 1]);
        var coords = [c11, c01, c00, c10];
        return quad([vec0, vec1, vec2, vec3], coords);
    }
    return square;
});
