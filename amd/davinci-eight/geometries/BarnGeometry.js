var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../geometries/Geometry', '../core/Face3', '../math/Vector3'], function (require, exports, Geometry, Face3, Vector3) {
    /**
     * The basic barn similar to that described in "Computer Graphics using OpenGL", by Hill and Kelly.
     * @class BarnGeometry
     */
    var BarnGeometry = (function (_super) {
        __extends(BarnGeometry, _super);
        function BarnGeometry() {
            _super.call(this);
            var vertexList = this.vertices;
            function vertex(x, y, z) {
                vertexList.push(new Vector3([x, y, z]));
            }
            vertex(-0.5, 0.0, -1.0);
            this.vertices.push(new Vector3([0.5, 0.0, -1.0]));
            this.vertices.push(new Vector3([0.5, 1.0, -1.0]));
            this.vertices.push(new Vector3([0.0, 1.5, -1.0]));
            this.vertices.push(new Vector3([-0.5, 1.0, -1.0]));
            this.vertices.push(new Vector3([-0.5, 0.0, 1.0]));
            this.vertices.push(new Vector3([0.5, 0.0, 1.0]));
            this.vertices.push(new Vector3([0.5, 1.0, 1.0]));
            this.vertices.push(new Vector3([0.0, 1.5, 1.0]));
            this.vertices.push(new Vector3([-0.5, 1.0, 1.0]));
            this.faces.push(new Face3(1, 0, 2));
            this.faces.push(new Face3(2, 0, 4));
            this.faces.push(new Face3(2, 4, 3));
            this.faces.push(new Face3(5, 6, 7));
            this.faces.push(new Face3(5, 7, 9));
            this.faces.push(new Face3(9, 7, 8));
            this.faces.push(new Face3(6, 1, 2));
            this.faces.push(new Face3(6, 2, 7));
            this.faces.push(new Face3(9, 0, 5));
            this.faces.push(new Face3(9, 4, 0));
            this.faces.push(new Face3(8, 3, 4));
            this.faces.push(new Face3(8, 4, 9));
            this.faces.push(new Face3(7, 2, 3));
            this.faces.push(new Face3(7, 3, 8));
            this.faces.push(new Face3(5, 0, 1));
            this.faces.push(new Face3(5, 1, 6));
            this.computeFaceNormals();
        }
        return BarnGeometry;
    })(Geometry);
    return BarnGeometry;
});
