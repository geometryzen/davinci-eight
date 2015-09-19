define(["require", "exports", '../dfx/Simplex', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, Simplex, Symbolic, Vector2, Vector3) {
    function buildPlane(u, v, udir, vdir, width, height, depth, widthSegments, heightSegments, depthSegments, materialIndex, points, faces) {
        var w;
        var ix;
        var iy;
        var gridX = widthSegments;
        var gridY = heightSegments;
        var width_half = width / 2;
        var height_half = height / 2;
        var offset = points.length;
        if ((u === 'x' && v === 'y') || (u === 'y' && v === 'x')) {
            w = 'z';
        }
        else if ((u === 'x' && v === 'z') || (u === 'z' && v === 'x')) {
            w = 'y';
            gridY = depthSegments;
        }
        else if ((u === 'z' && v === 'y') || (u === 'y' && v === 'z')) {
            w = 'x';
            gridX = depthSegments;
        }
        var gridX1 = gridX + 1;
        var gridY1 = gridY + 1;
        var segment_width = width / gridX;
        var segment_height = height / gridY;
        // The normal starts out as all zeros.
        var normal = new Vector3();
        // This bit of code sets the appropriate coordinate in the normal vector.
        normal[w] = depth > 0 ? 1 : -1;
        // Compute the points.
        for (iy = 0; iy < gridY1; iy++) {
            for (ix = 0; ix < gridX1; ix++) {
                var point = new Vector3();
                // This bit of code sets the appropriate coordinate in the position vector.
                point[u] = (ix * segment_width - width_half) * udir;
                point[v] = (iy * segment_height - height_half) * vdir;
                point[w] = depth;
                points.push(point);
            }
        }
        // Compute the triangular faces using the pre-computed points.
        for (iy = 0; iy < gridY; iy++) {
            for (ix = 0; ix < gridX; ix++) {
                var a = ix + gridX1 * iy;
                var b = ix + gridX1 * (iy + 1);
                var c = (ix + 1) + gridX1 * (iy + 1);
                var d = (ix + 1) + gridX1 * iy;
                var uva = new Vector2([ix / gridX, 1 - iy / gridY]);
                var uvb = new Vector2([ix / gridX, 1 - (iy + 1) / gridY]);
                var uvc = new Vector2([(ix + 1) / gridX, 1 - (iy + 1) / gridY]);
                var uvd = new Vector2([(ix + 1) / gridX, 1 - iy / gridY]);
                var face = new Simplex(Simplex.K_FOR_TRIANGLE);
                face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[a + offset];
                face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uva;
                face.vertices[0].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b + offset];
                face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                face.vertices[1].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d + offset];
                face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                face.vertices[2].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                faces.push(face);
                face = new Simplex(Simplex.K_FOR_TRIANGLE);
                face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b + offset];
                face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                face.vertices[0].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[c + offset];
                face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvc;
                face.vertices[1].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d + offset];
                face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                face.vertices[2].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                faces.push(face);
            }
        }
    }
    return buildPlane;
});
