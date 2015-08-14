var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Face3 = require('../core/Face3');
var Geometry = require('../geometries/Geometry');
var Vector2 = require('../math/Vector2');
var Vector3 = require('../math/Vector3');
var CylinderGeometry = (function (_super) {
    __extends(CylinderGeometry, _super);
    function CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
        if (radiusTop === void 0) { radiusTop = 1; }
        if (radiusBottom === void 0) { radiusBottom = 1; }
        if (height === void 0) { height = 1; }
        if (radialSegments === void 0) { radialSegments = 16; }
        if (heightSegments === void 0) { heightSegments = 1; }
        if (openEnded === void 0) { openEnded = false; }
        if (thetaStart === void 0) { thetaStart = 0; }
        if (thetaLength === void 0) { thetaLength = 2 * Math.PI; }
        _super.call(this);
        var heightHalf = height / 2;
        var x;
        var y;
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
                this.vertices.push(vertex);
                verticesRow.push(this.vertices.length - 1);
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
                na = this.vertices[vertices[0][x]].clone();
                nb = this.vertices[vertices[0][x + 1]].clone();
            }
            else {
                na = this.vertices[vertices[1][x]].clone();
                nb = this.vertices[vertices[1][x + 1]].clone();
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
                this.faces.push(new Face3(v1, v2, v4, [n1, n2, n4]));
                this.faceVertexUvs[0].push([uv1, uv2, uv4]);
                this.faces.push(new Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()]));
                this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()]);
            }
        }
        // top cap
        if (!openEnded && radiusTop > 0) {
            this.vertices.push(Vector3.e2.clone().multiplyScalar(heightHalf));
            for (x = 0; x < radialSegments; x++) {
                var v1 = vertices[0][x];
                var v2 = vertices[0][x + 1];
                var v3 = this.vertices.length - 1;
                var n1 = Vector3.e2;
                var n2 = Vector3.e2;
                var n3 = Vector3.e2;
                var uv1 = uvs[0][x].clone();
                var uv2 = uvs[0][x + 1].clone();
                var uv3 = new Vector2([uv2.x, 0]);
                this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
                this.faceVertexUvs[0].push([uv1, uv2, uv3]);
            }
        }
        // bottom cap
        if (!openEnded && radiusBottom > 0) {
            this.vertices.push(Vector3.e2.clone().multiplyScalar(-heightHalf));
            for (x = 0; x < radialSegments; x++) {
                var v1 = vertices[heightSegments][x + 1];
                var v2 = vertices[heightSegments][x];
                var v3 = this.vertices.length - 1;
                var n1 = Vector3.e2.clone().multiplyScalar(-1);
                var n2 = Vector3.e2.clone().multiplyScalar(-1);
                var n3 = Vector3.e2.clone().multiplyScalar(-1);
                var uv1 = uvs[heightSegments][x + 1].clone();
                var uv2 = uvs[heightSegments][x].clone();
                var uv3 = new Vector2([uv2.x, 1]);
                this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
                this.faceVertexUvs[0].push([uv1, uv2, uv3]);
            }
        }
    }
    return CylinderGeometry;
})(Geometry);
module.exports = CylinderGeometry;
