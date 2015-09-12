define(["require", "exports", '../checks/expectArg', '../dfx/Vertex', '../math/VectorN'], function (require, exports, expectArg, Vertex, VectorN) {
    function expectArgVectorN(name, vector) {
        return expectArg(name, vector).toSatisfy(vector instanceof VectorN, name + ' must be a VectorN').value;
    }
    function lerp(a, b, alpha, data) {
        if (data === void 0) { data = []; }
        expectArg('b', b).toSatisfy(a.length === b.length, "a must be the same length as b");
        var dims = a.length;
        var i;
        var beta = 1 - alpha;
        for (i = 0; i < dims; i++) {
            data.push(beta * a[i] + alpha * b[i]);
        }
        return data;
    }
    var Simplex = (function () {
        /**
         * @class Simplex
         * @constructor
         * @param points {VectorN<number>[]}
         */
        function Simplex(points) {
            this.vertices = [];
            this.vertices = points.map(function (point, index) {
                return new Vertex(expectArgVectorN('point', point));
            });
            var parent = this;
            this.vertices.forEach(function (vertex) {
                vertex.parent = parent;
            });
        }
        Simplex.indices = function (simplex) {
            return simplex.vertices.map(function (vertex) { return vertex.index; });
        };
        Simplex.subdivideOne = function (simplex) {
            expectArg('simplex', simplex).toBeObject();
            var divs = new Array();
            var vertices = simplex.vertices;
            var k = vertices.length;
            if (k === 3) {
                var a = vertices[0].position;
                var b = vertices[1].position;
                var c = vertices[2].position;
                var m1 = new VectorN(lerp(a.data, b.data, 0.5));
                var m2 = new VectorN(lerp(b.data, c.data, 0.5));
                var m3 = new VectorN(lerp(c.data, a.data, 0.5));
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
                var a = vertices[0].position;
                var b = vertices[1].position;
                var m = new VectorN(lerp(a.data, b.data, 0.5));
                var line1 = new Simplex([a, m]);
                var line2 = new Simplex([m, b]);
                divs.push(line1);
                divs.push(line2);
            }
            else if (k === 1) {
                divs.push(simplex);
            }
            else if (k === 0) {
                divs.push(simplex);
            }
            else {
                throw new Error(k + "-simplex is not supported");
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
