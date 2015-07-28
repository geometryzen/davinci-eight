var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../core/Face3', '../geometries/Geometry', '../math/Vector2', '../math/Vector3'], function (require, exports, Face3, Geometry, Vector2, Vector3) {
    var BoxGeometry = (function (_super) {
        __extends(BoxGeometry, _super);
        function BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments, wireFrame) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            if (depth === void 0) { depth = 1; }
            if (widthSegments === void 0) { widthSegments = 1; }
            if (heightSegments === void 0) { heightSegments = 1; }
            if (depthSegments === void 0) { depthSegments = 1; }
            if (wireFrame === void 0) { wireFrame = false; }
            _super.call(this);
            var width_half = width / 2;
            var height_half = height / 2;
            var depth_half = depth / 2;
            buildPlane('z', 'y', -1, -1, depth, height, +width_half, 0, this); // px
            buildPlane('z', 'y', +1, -1, depth, height, -width_half, 1, this); // nx
            buildPlane('x', 'z', +1, +1, width, depth, +height_half, 2, this); // py
            buildPlane('x', 'z', +1, -1, width, depth, -height_half, 3, this); // ny
            buildPlane('x', 'y', +1, -1, width, height, +depth_half, 4, this); // pz
            buildPlane('x', 'y', -1, -1, width, height, -depth_half, 5, this); // nz
            function buildPlane(u, v, udir, vdir, width, height, depth, unused, scope) {
                var w;
                var ix;
                var iy;
                var gridX = widthSegments;
                var gridY = heightSegments;
                var width_half = width / 2;
                var height_half = height / 2;
                var offset = scope.vertices.length;
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
                var gridX1 = gridX + 1, gridY1 = gridY + 1, segment_width = width / gridX, segment_height = height / gridY, normal = new Vector3();
                normal[w] = depth > 0 ? 1 : -1;
                for (iy = 0; iy < gridY1; iy++) {
                    for (ix = 0; ix < gridX1; ix++) {
                        var vector = new Vector3();
                        vector[u] = (ix * segment_width - width_half) * udir;
                        vector[v] = (iy * segment_height - height_half) * vdir;
                        vector[w] = depth;
                        scope.vertices.push(vector);
                    }
                }
                for (iy = 0; iy < gridY; iy++) {
                    for (ix = 0; ix < gridX; ix++) {
                        var a = ix + gridX1 * iy;
                        var b = ix + gridX1 * (iy + 1);
                        var c = (ix + 1) + gridX1 * (iy + 1);
                        var d = (ix + 1) + gridX1 * iy;
                        var uva = new Vector2(ix / gridX, 1 - iy / gridY);
                        var uvb = new Vector2(ix / gridX, 1 - (iy + 1) / gridY);
                        var uvc = new Vector2((ix + 1) / gridX, 1 - (iy + 1) / gridY);
                        var uvd = new Vector2((ix + 1) / gridX, 1 - iy / gridY);
                        var face = new Face3(a + offset, b + offset, d + offset);
                        face.normal.copy(normal);
                        face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone());
                        scope.faces.push(face);
                        scope.faceVertexUvs[0].push([uva, uvb, uvd]);
                        face = new Face3(b + offset, c + offset, d + offset);
                        face.normal.copy(normal);
                        face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone());
                        scope.faces.push(face);
                        scope.faceVertexUvs[0].push([uvb.clone(), uvc, uvd.clone()]);
                    }
                }
            }
            this.mergeVertices();
        }
        return BoxGeometry;
    })(Geometry);
    return BoxGeometry;
});
