define(["require", "exports", '../checks/expectArg', '../core/Symbolic', '../dfx/Vertex', '../math/Vector3'], function (require, exports, expectArg, Symbolic, Vertex, Vector3) {
    function expectArgVector3(name, vector) {
        return expectArg(name, vector).toSatisfy(vector instanceof Vector3, name + ' must be a Vector3').value;
    }
    var Simplex = (function () {
        /**
         * @class Simplex
         * @constructor
         * @param points {Vector3[]}
         */
        function Simplex(points) {
            this.vertices = [];
            this.vertices = points.map(function (point, index) {
                return new Vertex(expectArgVector3('point', point));
            });
            var parent = this;
            this.vertices.forEach(function (vertex) {
                vertex.parent = parent;
            });
        }
        Simplex.computeFaceNormals = function (simplex) {
            expectArg('simplex', simplex).toBeObject();
            expectArg('name', name).toBeString();
            var k = simplex.vertices.length;
            var vA = new Vector3(simplex.vertices[0].position.data);
            var vB = new Vector3(simplex.vertices[1].position.data);
            var vC = new Vector3(simplex.vertices[2].position.data);
            var cb = new Vector3().subVectors(vC, vB);
            var ab = new Vector3().subVectors(vA, vB);
            var normal = new Vector3().crossVectors(cb, ab).normalize();
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
            simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
        };
        Simplex.indices = function (simplex) {
            return simplex.vertices.map(function (vertex) { return vertex.index; });
        };
        Simplex.subdivideOne = function (simplex) {
            expectArg('simplex', simplex).toBeObject();
            var divs = new Array();
            var k = simplex.vertices.length;
            if (k === 3) {
                var a = simplex.vertices[0].position;
                var b = simplex.vertices[1].position;
                var c = simplex.vertices[2].position;
                var m1 = a.clone().lerp(b, 0.5);
                var m2 = b.clone().lerp(c, 0.5);
                var m3 = c.clone().lerp(a, 0.5);
                var face1 = new Simplex([c, m3, m2]);
                var face2 = new Simplex([a, m1, m3]);
                var face3 = new Simplex([b, m2, m1]);
                var face4 = new Simplex([m1, m2, m3]);
                divs.push(face1);
                divs.push(face2);
                divs.push(face3);
                divs.push(face4);
            }
            else if (k === 2) {
            }
            else if (k === 1) {
                divs.push(simplex);
            }
            else {
            }
            return divs;
        };
        Simplex.subdivide = function (faces) {
            return faces.map(Simplex.subdivideOne).reduce(function (a, b) { return a.concat(b); }, []);
        };
        return Simplex;
    })();
    return Simplex;
});
