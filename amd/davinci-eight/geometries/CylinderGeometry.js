var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/Geometry', '../geometries/Simplex', '../core/Symbolic', '../math/Vector2', '../math/Vector3'], function (require, exports, Geometry, Simplex, Symbolic, Vector2, Vector3) {
    function face(pt0, pt1, pt2, normals, uvs) {
        var simplex = new Simplex(Simplex.K_FOR_TRIANGLE);
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = pt0;
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = pt1;
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = pt2;
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0];
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[1];
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[2];
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[2];
        return simplex;
    }
    /**
     * @class CylinderGeometry
     */
    var CylinderGeometry = (function (_super) {
        __extends(CylinderGeometry, _super);
        /**
         * @class CylinderGeometry
         * @constructor
         * @param radiusTop [number = 1]
         * @param radiusBottom [number = 1]
         * @param height [number = 1]
         * @param radialSegments [number = 16]
         * @param heightSegments [number = 1]
         * @param openEnded [boolean = false]
         * @param thetaStart [number = 0]
         * @param thetaLength [number = 2 * Math.PI]
         */
        function CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
            if (radiusTop === void 0) { radiusTop = 1; }
            if (radiusBottom === void 0) { radiusBottom = 1; }
            if (height === void 0) { height = 1; }
            if (radialSegments === void 0) { radialSegments = 16; }
            if (heightSegments === void 0) { heightSegments = 1; }
            if (openEnded === void 0) { openEnded = false; }
            if (thetaStart === void 0) { thetaStart = 0; }
            if (thetaLength === void 0) { thetaLength = 2 * Math.PI; }
            radialSegments = Math.max(radialSegments, 3);
            heightSegments = Math.max(heightSegments, 1);
            _super.call(this);
            var heightHalf = height / 2;
            var x;
            var y;
            var points = [];
            var vertices = [];
            var uvs = [];
            for (y = 0; y <= heightSegments; y++) {
                var verticesRow = [];
                var uvsRow = [];
                var v = y / heightSegments;
                var radius = v * (radiusBottom - radiusTop) + radiusTop;
                for (x = 0; x <= radialSegments; x++) {
                    var u = x / radialSegments;
                    var vertex = new Vector3();
                    vertex.x = radius * Math.sin(u * thetaLength + thetaStart);
                    vertex.y = -v * height + heightHalf;
                    vertex.z = radius * Math.cos(u * thetaLength + thetaStart);
                    points.push(vertex);
                    verticesRow.push(points.length - 1);
                    uvsRow.push(new Vector2([u, 1 - v]));
                }
                vertices.push(verticesRow);
                uvs.push(uvsRow);
            }
            var tanTheta = (radiusBottom - radiusTop) / height;
            var na;
            var nb;
            for (x = 0; x < radialSegments; x++) {
                if (radiusTop !== 0) {
                    na = Vector3.copy(points[vertices[0][x]]);
                    nb = Vector3.copy(points[vertices[0][x + 1]]);
                }
                else {
                    na = Vector3.copy(points[vertices[1][x]]);
                    nb = Vector3.copy(points[vertices[1][x + 1]]);
                }
                na.setY(Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta).normalize();
                nb.setY(Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta).normalize();
                for (y = 0; y < heightSegments; y++) {
                    var v1 = vertices[y][x];
                    var v2 = vertices[y + 1][x];
                    var v3 = vertices[y + 1][x + 1];
                    var v4 = vertices[y][x + 1];
                    var n1 = na.clone();
                    var n2 = na.clone();
                    var n3 = nb.clone();
                    var n4 = nb.clone();
                    var uv1 = uvs[y][x].clone();
                    var uv2 = uvs[y + 1][x].clone();
                    var uv3 = uvs[y + 1][x + 1].clone();
                    var uv4 = uvs[y][x + 1].clone();
                    this.data.push(face(points[v1], points[v2], points[v4], [n1, n2, n4], [uv1, uv2, uv4]));
                    this.data.push(face(points[v2], points[v3], points[v4], [n2.clone(), n3, n4.clone()], [uv2.clone(), uv3, uv4.clone()]));
                }
            }
            // top cap
            if (!openEnded && radiusTop > 0) {
                points.push(Vector3.e2.clone().scale(heightHalf));
                for (x = 0; x < radialSegments; x++) {
                    var v1 = vertices[0][x];
                    var v2 = vertices[0][x + 1];
                    var v3 = points.length - 1;
                    var n1 = Vector3.e2.clone();
                    var n2 = Vector3.e2.clone();
                    var n3 = Vector3.e2.clone();
                    var uv1 = uvs[0][x].clone();
                    var uv2 = uvs[0][x + 1].clone();
                    var uv3 = new Vector2([uv2.x, 0]);
                    this.data.push(face(points[v1], points[v2], points[v3], [n1, n2, n3], [uv1, uv2, uv3]));
                }
            }
            // bottom cap
            if (!openEnded && radiusBottom > 0) {
                points.push(Vector3.e2.clone().scale(-heightHalf));
                for (x = 0; x < radialSegments; x++) {
                    var v1 = vertices[heightSegments][x + 1];
                    var v2 = vertices[heightSegments][x];
                    var v3 = points.length - 1;
                    var n1 = Vector3.e2.clone().scale(-1);
                    var n2 = Vector3.e2.clone().scale(-1);
                    var n3 = Vector3.e2.clone().scale(-1);
                    var uv1 = uvs[heightSegments][x + 1].clone();
                    var uv2 = uvs[heightSegments][x].clone();
                    var uv3 = new Vector2([uv2.x, 1]);
                    this.data.push(face(points[v1], points[v2], points[v3], [n1, n2, n3], [uv1, uv2, uv3]));
                }
            }
            //    this.computeFaceNormals();
            //    this.computeVertexNormals();
        }
        return CylinderGeometry;
    })(Geometry);
    return CylinderGeometry;
});
