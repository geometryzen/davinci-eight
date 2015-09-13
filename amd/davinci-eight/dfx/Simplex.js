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
         * @param k {number} The initial number of vertices in the simplex.
         */
        function Simplex(k) {
            this.vertices = [];
            expectArg('k', k).toBeNumber();
            for (var i = 0; i < k; i++) {
                this.vertices.push(new Vertex());
            }
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
                var face1 = new Simplex(k); //c, m3, m2
                face1.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = c;
                face1.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = m3;
                face1.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = m2;
                var face2 = new Simplex(k); // a, m1, m3
                face2.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = a;
                face2.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = m1;
                face2.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = m3;
                var face3 = new Simplex(k); // b, m2, m1
                face3.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = b;
                face3.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = m2;
                face3.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = m1;
                var face4 = new Simplex(k); // m1, m2, m3
                face4.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = m1;
                face4.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = m2;
                face4.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = m3;
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
                var line1 = new Simplex(k); // a, m
                line1.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = a;
                line1.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = m;
                var line2 = new Simplex(k); // m, b 
                line2.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = m;
                line2.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = b;
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
