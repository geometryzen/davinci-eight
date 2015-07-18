define(["require", "exports", '../math/Sphere', '../math/Vector3'], function (require, exports, Sphere, Vector3) {
    /**
     * @class Geometry
     */
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
        Geometry.prototype.mergeVertices = function () {
            var verticesMap = {}; // Hashmap for looking up vertice by position coordinates (and making sure they are unique)
            var unique = [], changes = [];
            var v;
            var key;
            var precisionPoints = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
            var precision = Math.pow(10, precisionPoints);
            var i;
            var il;
            var face;
            var indices, j, jl;
            for (i = 0, il = this.vertices.length; i < il; i++) {
                v = this.vertices[i];
                key = Math.round(v.x * precision) + '_' + Math.round(v.y * precision) + '_' + Math.round(v.z * precision);
                if (verticesMap[key] === undefined) {
                    verticesMap[key] = i;
                    unique.push(this.vertices[i]);
                    changes[i] = unique.length - 1;
                }
                else {
                    //console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
                    changes[i] = changes[verticesMap[key]];
                }
            }
            ;
            // if faces are completely degenerate after merging vertices, we
            // have to remove them.
            var faceIndicesToRemove = [];
            for (i = 0, il = this.faces.length; i < il; i++) {
                face = this.faces[i];
                face.a = changes[face.a];
                face.b = changes[face.b];
                face.c = changes[face.c];
                indices = [face.a, face.b, face.c];
                var dupIndex = -1;
                // if any duplicate vertices are found in a Face3
                // we have to remove the face as nothing can be saved
                for (var n = 0; n < 3; n++) {
                    if (indices[n] == indices[(n + 1) % 3]) {
                        dupIndex = n;
                        faceIndicesToRemove.push(i);
                        break;
                    }
                }
            }
            for (i = faceIndicesToRemove.length - 1; i >= 0; i--) {
                var idx = faceIndicesToRemove[i];
                this.faces.splice(idx, 1);
                for (j = 0, jl = this.faceVertexUvs.length; j < jl; j++) {
                    this.faceVertexUvs[j].splice(idx, 1);
                }
            }
            // Use unique set of vertices
            var diff = this.vertices.length - unique.length;
            this.vertices = unique;
            return diff;
        };
        return Geometry;
    })();
    return Geometry;
});
