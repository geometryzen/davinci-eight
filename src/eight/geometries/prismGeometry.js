define(["require", "exports", 'eight/core/geometry', 'eight/math/e3ga/vectorE3'], function(require, exports, geometry, vectorE3) {
    var vertexList = [
        vectorE3(-1.0, 0.0, +0.5),
        vectorE3(0.0, 0.0, +0.5),
        vectorE3(1.0, 0.0, +0.5),
        vectorE3(-0.5, 1.0, +0.5),
        vectorE3(0.5, 1.0, +0.5),
        vectorE3(0.0, 2.0, +0.5),
        vectorE3(-1.0, 0.0, -0.5),
        vectorE3(0.0, 0.0, -0.5),
        vectorE3(1.0, 0.0, -0.5),
        vectorE3(-0.5, 1.0, -0.5),
        vectorE3(0.5, 1.0, -0.5),
        vectorE3(0.0, 2.0, -0.5)
    ];

    var triangles = [
        [0, 1, 3],
        [1, 4, 3],
        [1, 2, 4],
        [3, 4, 5],
        [6, 9, 7],
        [7, 9, 10],
        [7, 10, 8],
        [9, 11, 10],
        [0, 3, 6],
        [3, 9, 6],
        [3, 5, 9],
        [5, 11, 9],
        [2, 8, 4],
        [4, 8, 10],
        [4, 10, 5],
        [5, 10, 11],
        [0, 6, 8],
        [0, 8, 2]
    ];

    var prismGeometry = function (spec) {
        var base = geometry(spec);

        var api = {
            triangles: triangles,
            vertices: [],
            normals: [],
            colors: []
        };

        for (var t = 0; t < triangles.length; t++) {
            var triangle = triangles[t];

            var v0 = vertexList[triangle[0]];
            var v1 = vertexList[triangle[1]];
            var v2 = vertexList[triangle[2]];

            var perp = v1.sub(v0).cross(v2.sub(v0));
            var normal = perp.div(perp.norm());

            for (var j = 0; j < 3; j++) {
                api.vertices.push(vertexList[triangle[j]].x);
                api.vertices.push(vertexList[triangle[j]].y);
                api.vertices.push(vertexList[triangle[j]].z);

                api.normals.push(normal.x);
                api.normals.push(normal.y);
                api.normals.push(normal.z);

                api.colors.push(1.0);
                api.colors.push(0.0);
                api.colors.push(0.0);
            }
        }
        return api;
    };

    
    return prismGeometry;
});
