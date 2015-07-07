var Sphere = require('../math/Sphere');
var Vector3 = require('../math/Vector3');
var Geometry = (function () {
    function Geometry() {
        this.vertices = [];
        this.faces = [];
        this.faceVertexUvs = [[]];
        this.dynamic = true;
        this.verticesNeedUpdate = false;
        this.elementsNeedUpdate = false;
        this.uvsNeedUpdate = false;
        this.boundingSphere = null;
    }
    Geometry.prototype.computeBoundingSphere = function () {
        if (this.boundingSphere === null) {
            this.boundingSphere = new Sphere();
        }
        this.boundingSphere.setFromPoints(this.vertices);
    };
    Geometry.prototype.computeFaceNormals = function () {
        var cb = new Vector3();
        var ab = new Vector3();
        for (var f = 0, fl = this.faces.length; f < fl; f++) {
            var face = this.faces[f];
            var vA = this.vertices[face.a];
            var vB = this.vertices[face.b];
            var vC = this.vertices[face.c];
            cb.subVectors(vC, vB);
            ab.subVectors(vA, vB);
            cb.cross(ab);
            cb.normalize();
            face.normal.copy(cb);
        }
    };
    Geometry.prototype.computeVertexNormals = function (areaWeighted) {
        var v;
        var vl = this.vertices.length;
        var f;
        var fl;
        var face;
        // For each vertex, we will compute a vertexNormal.
        // Store the results in an Array<Vector3>
        var vertexNormals = new Array(this.vertices.length);
        for (v = 0, vl = this.vertices.length; v < vl; v++) {
            vertexNormals[v] = new Vector3();
        }
        if (areaWeighted) {
            // vertex normals weighted by triangle areas
            // http://www.iquilezles.org/www/articles/normals/normals.htm
            var vA;
            var vB;
            var vC;
            var cb = new Vector3();
            var ab = new Vector3();
            for (f = 0, fl = this.faces.length; f < fl; f++) {
                face = this.faces[f];
                vA = this.vertices[face.a];
                vB = this.vertices[face.b];
                vC = this.vertices[face.c];
                cb.subVectors(vC, vB);
                ab.subVectors(vA, vB);
                cb.cross(ab);
                vertexNormals[face.a].add(cb);
                vertexNormals[face.b].add(cb);
                vertexNormals[face.c].add(cb);
            }
        }
        else {
            for (f = 0, fl = this.faces.length; f < fl; f++) {
                face = this.faces[f];
                vertexNormals[face.a].add(face.normal);
                vertexNormals[face.b].add(face.normal);
                vertexNormals[face.c].add(face.normal);
            }
        }
        for (v = 0, vl = this.vertices.length; v < vl; v++) {
            vertexNormals[v].normalize();
        }
        for (f = 0, fl = this.faces.length; f < fl; f++) {
            face = this.faces[f];
            face.vertexNormals[0] = vertexNormals[face.a].clone();
            face.vertexNormals[1] = vertexNormals[face.b].clone();
            face.vertexNormals[2] = vertexNormals[face.c].clone();
        }
    };
    return Geometry;
})();
module.exports = Geometry;
