define(["require", "exports", '../checks/expectArg', '../dfx/FaceVertex', '../math/Vector3', '../dfx/makeFaceNormalCallback'], function (require, exports, expectArg, FaceVertex, Vector3, makeFaceNormalCallback) {
    function expectArgVector3(name, vector) {
        return expectArg(name, vector).toSatisfy(vector instanceof Vector3, name + ' must be a Vector3').value;
    }
    var Face = (function () {
        /**
         * @class Face
         * @constructor
         * @param a {FaceVertex}
         * @param b {FaceVertex}
         * @param c {FaceVertex}
         */
        function Face(a, b, c) {
            this._normal = new Vector3();
            this.a = new FaceVertex(expectArgVector3('a', a));
            this.b = new FaceVertex(expectArgVector3('b', b));
            this.c = new FaceVertex(expectArgVector3('c', c));
            this.a.parent = this;
            this.b.parent = this;
            this.c.parent = this;
            this._normal.callback = makeFaceNormalCallback(this);
        }
        Object.defineProperty(Face.prototype, "normal", {
            get: function () {
                return this._normal;
            },
            enumerable: true,
            configurable: true
        });
        return Face;
    })();
    return Face;
});
