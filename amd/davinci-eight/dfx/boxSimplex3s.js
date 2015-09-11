define(["require", "exports", '../dfx/Simplex3Geometry', '../dfx/Simplex3', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, Simplex3Geometry, Simplex3, Symbolic, Vector2, Vector3) {
    function square(vecs, geometry, coords) {
        var faces = new Array();
        var f012 = new Simplex3(vecs[0], vecs[1], vecs[2]);
        f012.a.attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[0];
        f012.b.attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[1];
        f012.c.attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[2];
        geometry.addFace(f012);
        faces.push(f012);
        var f023 = new Simplex3(vecs[0], vecs[2], vecs[3]);
        f023.a.attributes[Symbolic.ATTRIBUTE_TEXTURE] = f012.a.attributes[Symbolic.ATTRIBUTE_TEXTURE];
        f023.b.attributes[Symbolic.ATTRIBUTE_TEXTURE] = f012.c.attributes[Symbolic.ATTRIBUTE_TEXTURE];
        f023.c.attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[3];
        geometry.addFace(f023);
        faces.push(f023);
        return faces;
    }
    function boxSimplex3s() {
        // box
        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3
        //
        var geometry = new Simplex3Geometry();
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
        square([vec0, vec1, vec2, vec3], geometry, coords); // front
        square([vec0, vec3, vec4, vec5], geometry, coords); // right
        square([vec0, vec5, vec6, vec1], geometry, coords); // top
        square([vec1, vec6, vec7, vec2], geometry, coords); // left
        square([vec7, vec4, vec3, vec2], geometry, coords); // bottom
        square([vec4, vec7, vec6, vec5], geometry, coords); // back
        // GEOMETRY IS REALLY redundant now.
        return geometry.faces;
    }
    return boxSimplex3s;
});