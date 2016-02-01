define(["require", "exports", '../checks/expectArg', '../checks/isInteger', '../geometries/Vertex', '../math/VectorN'], function (require, exports, expectArg_1, isInteger_1, Vertex_1, VectorN_1) {
    function checkIntegerArg(name, n, min, max) {
        if (isInteger_1.default(n) && n >= min && n <= max) {
            return n;
        }
        expectArg_1.default(name, n).toSatisfy(false, name + " must be an integer in the range [" + min + "," + max + "]");
    }
    function checkCountArg(count) {
        return checkIntegerArg('count', count, 0, 7);
    }
    function concatReduce(a, b) {
        return a.concat(b);
    }
    function expectArgVectorN(name, vector) {
        return expectArg_1.default(name, vector).toSatisfy(vector instanceof VectorN_1.default, name + ' must be a VectorN').value;
    }
    function lerp(a, b, alpha, data) {
        if (data === void 0) { data = []; }
        expectArg_1.default('b', b).toSatisfy(a.length === b.length, "a must be the same length as b");
        var dims = a.length;
        var i;
        var beta = 1 - alpha;
        for (i = 0; i < dims; i++) {
            data.push(beta * a[i] + alpha * b[i]);
        }
        return data;
    }
    function lerpVertexAttributeMap(a, b, alpha) {
        var attribMap = {};
        var keys = Object.keys(a);
        var keysLength = keys.length;
        for (var k = 0; k < keysLength; k++) {
            var key = keys[k];
            attribMap[key] = lerpVectorN(a[key], b[key], alpha);
        }
        return attribMap;
    }
    function lerpVectorN(a, b, alpha) {
        return new VectorN_1.default(lerp(a.coords, b.coords, alpha));
    }
    var Simplex = (function () {
        function Simplex(k) {
            this.vertices = [];
            if (!isInteger_1.default(k)) {
                expectArg_1.default('k', k).toBeNumber();
            }
            var numVertices = k + 1;
            for (var i = 0; i < numVertices; i++) {
                this.vertices.push(new Vertex_1.default());
            }
        }
        Object.defineProperty(Simplex.prototype, "k", {
            get: function () {
                return this.vertices.length - 1;
            },
            enumerable: true,
            configurable: true
        });
        Simplex.indices = function (simplex) {
            return simplex.vertices.map(function (vertex) { return vertex.index; });
        };
        Simplex.boundaryMap = function (simplex) {
            var vertices = simplex.vertices;
            var k = simplex.k;
            if (k === Simplex.TRIANGLE) {
                var line01 = new Simplex(k - 1);
                line01.vertices[0].attributes = simplex.vertices[0].attributes;
                line01.vertices[1].attributes = simplex.vertices[1].attributes;
                var line12 = new Simplex(k - 1);
                line12.vertices[0].attributes = simplex.vertices[1].attributes;
                line12.vertices[1].attributes = simplex.vertices[2].attributes;
                var line20 = new Simplex(k - 1);
                line20.vertices[0].attributes = simplex.vertices[2].attributes;
                line20.vertices[1].attributes = simplex.vertices[0].attributes;
                return [line01, line12, line20];
            }
            else if (k === Simplex.LINE) {
                var point0 = new Simplex(k - 1);
                point0.vertices[0].attributes = simplex.vertices[0].attributes;
                var point1 = new Simplex(k - 1);
                point1.vertices[0].attributes = simplex.vertices[1].attributes;
                return [point0, point1];
            }
            else if (k === Simplex.POINT) {
                return [new Simplex(k - 1)];
            }
            else if (k === Simplex.EMPTY) {
                return [];
            }
            else {
                throw new Error("Unexpected k-simplex, k = " + simplex.k + " @ Simplex.boundaryMap()");
            }
        };
        Simplex.subdivideMap = function (simplex) {
            expectArg_1.default('simplex', simplex).toBeObject();
            var divs = [];
            var vertices = simplex.vertices;
            var k = simplex.k;
            if (k === Simplex.TRIANGLE) {
                var a = vertices[0].attributes;
                var b = vertices[1].attributes;
                var c = vertices[2].attributes;
                var m1 = lerpVertexAttributeMap(a, b, 0.5);
                var m2 = lerpVertexAttributeMap(b, c, 0.5);
                var m3 = lerpVertexAttributeMap(c, a, 0.5);
                var face1 = new Simplex(k);
                face1.vertices[0].attributes = c;
                face1.vertices[1].attributes = m3;
                face1.vertices[2].attributes = m2;
                var face2 = new Simplex(k);
                face2.vertices[0].attributes = a;
                face2.vertices[1].attributes = m1;
                face2.vertices[2].attributes = m3;
                var face3 = new Simplex(k);
                face3.vertices[0].attributes = b;
                face3.vertices[1].attributes = m2;
                face3.vertices[2].attributes = m1;
                var face4 = new Simplex(k);
                face4.vertices[0].attributes = m1;
                face4.vertices[1].attributes = m2;
                face4.vertices[2].attributes = m3;
                divs.push(face1);
                divs.push(face2);
                divs.push(face3);
                divs.push(face4);
            }
            else if (k === Simplex.LINE) {
                var a = vertices[0].attributes;
                var b = vertices[1].attributes;
                var m = lerpVertexAttributeMap(a, b, 0.5);
                var line1 = new Simplex(k);
                line1.vertices[0].attributes = a;
                line1.vertices[1].attributes = m;
                var line2 = new Simplex(k);
                line2.vertices[0].attributes = m;
                line2.vertices[1].attributes = b;
                divs.push(line1);
                divs.push(line2);
            }
            else if (k === Simplex.POINT) {
                divs.push(simplex);
            }
            else if (k === Simplex.EMPTY) {
            }
            else {
                throw new Error(k + "-simplex is not supported");
            }
            return divs;
        };
        Simplex.boundary = function (simplices, count) {
            if (count === void 0) { count = 1; }
            checkCountArg(count);
            for (var i = 0; i < count; i++) {
                simplices = simplices.map(Simplex.boundaryMap).reduce(concatReduce, []);
            }
            return simplices;
        };
        Simplex.subdivide = function (simplices, count) {
            if (count === void 0) { count = 1; }
            checkCountArg(count);
            for (var i = 0; i < count; i++) {
                simplices = simplices.map(Simplex.subdivideMap).reduce(concatReduce, []);
            }
            return simplices;
        };
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
        Simplex.EMPTY = -1;
        Simplex.POINT = 0;
        Simplex.LINE = 1;
        Simplex.TRIANGLE = 2;
        Simplex.TETRAHEDRON = 3;
        Simplex.FIVE_CELL = 4;
        return Simplex;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Simplex;
});
