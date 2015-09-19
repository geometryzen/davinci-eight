define(["require", "exports", '../checks/expectArg', '../checks/isInteger', '../dfx/Vertex', '../math/VectorN'], function (require, exports, expectArg, isInteger, Vertex, VectorN) {
    function checkIntegerArg(name, n, min, max) {
        if (isInteger(n) && n >= min && n <= max) {
            return n;
        }
        // TODO: I don't suppose we can go backwards with a negative count? Hmmm...
        // expectArg(name, n).toBeInClosedInterval(min, max);
        expectArg(name, n).toSatisfy(false, name + " must be an integer in the range [" + min + "," + max + "]");
    }
    function checkCountArg(count) {
        // TODO: The count range should depend upon the k value of the simplex.
        return checkIntegerArg('count', count, 0, 7);
    }
    function concatReduce(a, b) {
        return a.concat(b);
    }
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
    // TODO: Looks like a static of VectorN or a common function.
    function lerpVectorN(a, b, alpha) {
        return new VectorN(lerp(a.data, b.data, alpha));
    }
    /**
     * A simplex is the generalization of a triangle or tetrahedron to arbitrary dimensions.
     * A k-simplex is the convex hull of its k + 1 vertices.
     * @class Simplex
     */
    var Simplex = (function () {
        /**
         * @class Simplex
         * @constructor
         * @param k {number} The initial number of vertices in the simplex is k + 1.
         */
        function Simplex(k) {
            /**
             * The vertices of the simplex.
             * @property
             * @type {Vertex[]}
             */
            this.vertices = [];
            if (!isInteger(k)) {
                expectArg('k', k).toBeNumber();
            }
            var numVertices = k + 1;
            for (var i = 0; i < numVertices; i++) {
                this.vertices.push(new Vertex());
            }
            var parent = this;
            this.vertices.forEach(function (vertex) {
                vertex.parent = parent;
            });
        }
        Object.defineProperty(Simplex.prototype, "k", {
            /**
             * The dimensionality of the simplex.
             * @property k
             * @type {number}
             * @readonly
             */
            get: function () {
                return this.vertices.length - 1;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         */
        // FIXME: We don't need the index property on the vertex (needs some work).
        Simplex.indices = function (simplex) {
            return simplex.vertices.map(function (vertex) { return vertex.index; });
        };
        /**
         * Computes the boundary of the simplex.
         * @method boundaryMap
         * @param simplex {Simplex}
         * @return {Simplex[]}
         * @private
         */
        Simplex.boundaryMap = function (simplex) {
            var vertices = simplex.vertices;
            var k = simplex.k;
            if (k === Simplex.K_FOR_TRIANGLE) {
                var line01 = new Simplex(k - 1);
                line01.vertices[0].parent = line01;
                line01.vertices[0].attributes = simplex.vertices[0].attributes;
                line01.vertices[1].parent = line01;
                line01.vertices[1].attributes = simplex.vertices[1].attributes;
                var line12 = new Simplex(k - 1);
                line12.vertices[0].parent = line12;
                line12.vertices[0].attributes = simplex.vertices[1].attributes;
                line12.vertices[1].parent = line12;
                line12.vertices[1].attributes = simplex.vertices[2].attributes;
                var line20 = new Simplex(k - 1);
                line20.vertices[0].parent = line20;
                line20.vertices[0].attributes = simplex.vertices[2].attributes;
                line20.vertices[1].parent = line20;
                line20.vertices[1].attributes = simplex.vertices[0].attributes;
                return [line01, line12, line20];
            }
            else if (k === Simplex.K_FOR_LINE_SEGMENT) {
                var point0 = new Simplex(k - 1);
                point0.vertices[0].parent = point0;
                point0.vertices[0].attributes = simplex.vertices[0].attributes;
                var point1 = new Simplex(k - 1);
                point1.vertices[0].parent = point1;
                point1.vertices[0].attributes = simplex.vertices[1].attributes;
                return [point0, point1];
            }
            else if (k === Simplex.K_FOR_POINT) {
                // For consistency, we get one empty simplex rather than an empty list.
                return [new Simplex(k - 1)];
            }
            else if (k === Simplex.K_FOR_EMPTY) {
                return [];
            }
            else {
                // TODO: Handle the TETRAHEDRON and general cases.
                throw new Error("Unexpected k-simplex, k = " + simplex.k + " @ Simplex.boundaryMap()");
            }
        };
        Simplex.subdivideMap = function (simplex) {
            expectArg('simplex', simplex).toBeObject();
            var divs = [];
            var vertices = simplex.vertices;
            var k = simplex.k;
            if (k === Simplex.K_FOR_TRIANGLE) {
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
            else if (k === Simplex.K_FOR_LINE_SEGMENT) {
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
            else if (k === Simplex.K_FOR_POINT) {
                divs.push(simplex);
            }
            else if (k === Simplex.K_FOR_EMPTY) {
            }
            else {
                throw new Error(k + "-simplex is not supported");
            }
            return divs;
        };
        /**
         * Computes the result of the boundary operation performed `count` times.
         * @method boundary
         * @param simplices {Simplex[]}
         * @param count {number}
         * @return {Simplex[]}
         */
        Simplex.boundary = function (simplices, count) {
            if (count === void 0) { count = 1; }
            checkCountArg(count);
            for (var i = 0; i < count; i++) {
                simplices = simplices.map(Simplex.boundaryMap).reduce(concatReduce, []);
            }
            return simplices;
        };
        /**
         * Computes the result of the subdivide operation performed `count` times.
         * @method subdivide
         * @param simplices {Simplex[]}
         * @param count {number}
         * @return {Simplex[]}
         */
        Simplex.subdivide = function (simplices, count) {
            if (count === void 0) { count = 1; }
            checkCountArg(count);
            for (var i = 0; i < count; i++) {
                simplices = simplices.map(Simplex.subdivideMap).reduce(concatReduce, []);
            }
            return simplices;
        };
        // TODO: This function destined to be part of Simplex constructor.
        // FIXME still used from triangle.ts!
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
        // These symbolic constants represent the correct k values for various low-dimesional simplices. 
        // The number of vertices in a k-simplex is k + 1.
        /**
         * An empty set can be consired to be a -1 simplex (algebraic topology).
         * @property K_FOR_EMPTY
         * @type {number}
         * @static
         */
        Simplex.K_FOR_EMPTY = -1;
        /**
         * A single point may be considered a 0-simplex.
         * @property K_FOR_POINT
         * @type {number}
         * @static
         */
        Simplex.K_FOR_POINT = 0;
        /**
         * A line segment may be considered a 1-simplex.
         * @property K_FOR_LINE_SEGMENT
         * @type {number}
         * @static
         */
        Simplex.K_FOR_LINE_SEGMENT = 1;
        /**
         * A 2-simplex is a triangle.
         * @property K_FOR_TRIANGLE
         * @type {number}
         * @static
         */
        Simplex.K_FOR_TRIANGLE = 2;
        /**
         * A 3-simplex is a tetrahedron.
         * @property K_FOR_TETRAHEDRON
         * @type {number}
         * @static
         */
        Simplex.K_FOR_TETRAHEDRON = 3;
        /**
         * A 4-simplex is a 5-cell.
         * @property K_FOR_FIVE_CELL
         * @type {number}
         * @static
         */
        Simplex.K_FOR_FIVE_CELL = 4;
        return Simplex;
    })();
    return Simplex;
});
