define(["require", "exports", '../checks/expectArg', '../core/Symbolic', '../dfx/Vertex', '../math/VectorN'], function (require, exports, expectArg, Symbolic, Vertex, VectorN) {
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
                // TODO: Need to lerp all attributes? YES! See below.
                // FIXME: This should not be special.
                var a = vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION];
                var b = vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION];
                var c = vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION];
                var m1 = new VectorN(lerp(a.data, b.data, 0.5));
                var m2 = new VectorN(lerp(b.data, c.data, 0.5));
                var m3 = new VectorN(lerp(c.data, a.data, 0.5));
                var face1 = new Simplex([c, m3, m2]);
                var face2 = new Simplex([a, m1, m3]);
                var face3 = new Simplex([b, m2, m1]);
                var face4 = new Simplex([m1, m2, m3]);
                // TODO: subdivision is losing attributes.
                divs.push(face1);
                divs.push(face2);
                divs.push(face3);
                divs.push(face4);
            }
            else if (k === 2) {
                var a = vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION];
                var b = vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION];
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
        // TODO: This function destined to be part of Simplex constructor.
        Simplex.setAttributeValues = function (attributes, simplex) {
            var names = Object.keys(attributes);
            var attribsLength = names.length;
            var attribIndex;
            for (attribIndex = 0; attribIndex < attribsLength; attribIndex++) {
                var name_1 = names[attribIndex];
                var values = attributes[name_1];
                var valuesLength = values.length;
                var valueIndex = void 0;
                for (valueIndex = 0; valueIndex < valuesLength; valueIndex++) {
                    simplex.vertices[valueIndex].attributes[name_1] = values[valueIndex];
                }
            }
        };
        return Simplex;
    })();
    return Simplex;
});
