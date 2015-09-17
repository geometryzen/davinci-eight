var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Face3 = require('../core/Face3');
var Geometry = require('../geometries/Geometry');
var Sphere = require('../math/Sphere');
var Vector2 = require('../math/Vector2');
var Vector3 = require('../math/Vector3');
var SphereGeometry = (function (_super) {
    __extends(SphereGeometry, _super);
    function SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
        if (radius === void 0) { radius = 1; }
        if (widthSegments === void 0) { widthSegments = 16; }
        if (heightSegments === void 0) { heightSegments = 12; }
        if (phiStart === void 0) { phiStart = 0; }
        if (phiLength === void 0) { phiLength = 2 * Math.PI; }
        if (thetaStart === void 0) { thetaStart = 0; }
        if (thetaLength === void 0) { thetaLength = Math.PI; }
        _super.call(this);
        var x;
        var y;
        var vertices = [];
        var uvs = [];
        for (y = 0; y <= heightSegments; y++) {
            var verticesRow = [];
            var uvsRow = [];
            for (x = 0; x <= widthSegments; x++) {
                var u = x / widthSegments;
                var v = y / heightSegments;
                var vertex = new Vector3([0, 0, 0]);
                vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                this.vertices.push(vertex);
                verticesRow.push(this.vertices.length - 1);
                uvsRow.push(new Vector2([u, 1 - v]));
            }
            vertices.push(verticesRow);
            uvs.push(uvsRow);
        }
        for (y = 0; y < heightSegments; y++) {
            for (x = 0; x < widthSegments; x++) {
                var v1 = vertices[y][x + 1];
                var v2 = vertices[y][x];
                var v3 = vertices[y + 1][x];
                var v4 = vertices[y + 1][x + 1];
                var n1 = Vector3.copy(this.vertices[v1]).normalize();
                var n2 = Vector3.copy(this.vertices[v2]).normalize();
                var n3 = Vector3.copy(this.vertices[v3]).normalize();
                var n4 = Vector3.copy(this.vertices[v4]).normalize();
                var uv1 = uvs[y][x + 1].clone();
                var uv2 = uvs[y][x].clone();
                var uv3 = uvs[y + 1][x].clone();
                var uv4 = uvs[y + 1][x + 1].clone();
                if (Math.abs(this.vertices[v1].y) === radius) {
                    uv1.x = (uv1.x + uv2.x) / 2;
                    this.faces.push(new Face3(v1, v3, v4, [n1, n3, n4]));
                    this.faceVertexUvs[0].push([uv1, uv3, uv4]);
                }
                else if (Math.abs(this.vertices[v3].y) === radius) {
                    uv3.x = (uv3.x + uv4.x) / 2;
                    this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
                    this.faceVertexUvs[0].push([uv1, uv2, uv3]);
                }
                else {
                    this.faces.push(new Face3(v1, v2, v4, [n1, n2, n4]));
                    this.faceVertexUvs[0].push([uv1, uv2, uv4]);
                    this.faces.push(new Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()]));
                    this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()]);
                }
            }
        }
        this.boundingSphere = new Sphere(new Vector3([0, 0, 0]), radius);
    }
    return SphereGeometry;
})(Geometry);
module.exports = SphereGeometry;
