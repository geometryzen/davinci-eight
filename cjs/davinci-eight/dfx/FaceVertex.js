var expectArg = require('../checks/expectArg');
var isUndefined = require('../checks/isUndefined');
var Vector3 = require('../math/Vector3');
var makeFaceNormalCallback = require('../dfx/makeFaceNormalCallback');
function expectArgVector3(name, vector) {
    return expectArg(name, vector).toSatisfy(vector instanceof Vector3, name + ' must be a Vector3').value;
}
var FaceVertex = (function () {
    function FaceVertex(position, normal, coords) {
        this.position = expectArgVector3('position', position);
        this.normal = normal;
        this.coords = coords;
    }
    Object.defineProperty(FaceVertex.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (value) {
            this._parent = value;
            if (isUndefined(this.normal)) {
                this.normal = new Vector3();
                this.normal.callback = makeFaceNormalCallback(this._parent);
            }
        },
        enumerable: true,
        configurable: true
    });
    return FaceVertex;
})();
module.exports = FaceVertex;
