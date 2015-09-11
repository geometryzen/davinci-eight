define(["require", "exports", '../checks/expectArg', '../dfx/Simplex3Vertex', '../math/Vector3', '../dfx/makeSimplex3NormalCallback'], function (require, exports, expectArg, Simplex3Vertex, Vector3, makeSimplex3NormalCallback) {
    function expectArgVector3(name, vector) {
        return expectArg(name, vector).toSatisfy(vector instanceof Vector3, name + ' must be a Vector3').value;
    }
    var Simplex3 = (function () {
        /**
         * @class Simplex3
         * @constructor
         * @param a {Simplex3Vertex}
         * @param b {Simplex3Vertex}
         * @param c {Simplex3Vertex}
         */
        function Simplex3(a, b, c) {
            this._normal = new Vector3();
            this.a = new Simplex3Vertex(expectArgVector3('a', a));
            this.b = new Simplex3Vertex(expectArgVector3('b', b));
            this.c = new Simplex3Vertex(expectArgVector3('c', c));
            this.a.parent = this;
            this.b.parent = this;
            this.c.parent = this;
            this._normal.callback = makeSimplex3NormalCallback(this);
        }
        Object.defineProperty(Simplex3.prototype, "normal", {
            get: function () {
                return this._normal;
            },
            enumerable: true,
            configurable: true
        });
        Simplex3.indices = function (face) {
            return [face.a.index, face.b.index, face.c.index];
        };
        Simplex3.subdivideOne = function (face) {
            var faces = new Array();
            var aVertex = face.a;
            var a = aVertex.position;
            var bVertex = face.b;
            var b = bVertex.position;
            var cVertex = face.c;
            var c = cVertex.position;
            var m1 = a.clone().lerp(b, 0.5);
            var m2 = b.clone().lerp(c, 0.5);
            var m3 = c.clone().lerp(a, 0.5);
            var face1 = new Simplex3(c, m3, m2);
            var face2 = new Simplex3(a, m1, m3);
            var face3 = new Simplex3(b, m2, m1);
            var face4 = new Simplex3(m1, m2, m3);
            faces.push(face1);
            faces.push(face2);
            faces.push(face3);
            faces.push(face4);
            return faces;
        };
        Simplex3.subdivide = function (faces) {
            return faces.map(Simplex3.subdivideOne).reduce(function (a, b) { return a.concat(b); }, []);
        };
        return Simplex3;
    })();
    return Simplex3;
});
