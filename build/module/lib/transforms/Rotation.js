import { mustBeObject } from '../checks/mustBeObject';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
var Rotation = /** @class */ (function () {
    function Rotation(R, names) {
        this.R = Spinor3.copy(mustBeObject('R', R));
        this.names = names;
    }
    Rotation.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var nLength = this.names.length;
        for (var k = 0; k < nLength; k++) {
            var aName = this.names[k];
            var v = vertex.attributes[aName];
            if (v.length === 3) {
                var vector = Vector3.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2));
                vector.rotate(this.R);
                vertex.attributes[aName] = vector;
            }
            else if (v.length === 4) {
                var spinor = Spinor3.spinor(v.getComponent(0), v.getComponent(1), v.getComponent(2), v.getComponent(3));
                spinor.rotate(this.R);
                vertex.attributes[aName] = spinor;
            }
            else {
                throw new Error("Expecting " + aName + " to be a vector with 3 coordinates");
            }
        }
    };
    return Rotation;
}());
export { Rotation };
