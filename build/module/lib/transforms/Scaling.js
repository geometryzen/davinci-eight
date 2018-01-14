import { mustBeArray } from '../checks/mustBeArray';
import { mustBeObject } from '../checks/mustBeObject';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
var Scaling = /** @class */ (function () {
    function Scaling(stress, names) {
        this.stress = Vector3.copy(mustBeObject('stress', stress));
        this.names = mustBeArray('names', names);
    }
    Scaling.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var nLength = this.names.length;
        for (var k = 0; k < nLength; k++) {
            var aName = this.names[k];
            var v = vertex.attributes[aName];
            if (v) {
                if (v.length === 3) {
                    var vector = Vector3.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2));
                    vector.stress(this.stress);
                    vertex.attributes[aName] = vector;
                }
                else if (v.length === 4) {
                    var spinor = Spinor3.spinor(v.getComponent(0), v.getComponent(1), v.getComponent(2), v.getComponent(3));
                    spinor.stress(this.stress);
                    vertex.attributes[aName] = spinor;
                }
                else {
                    throw new Error("Expecting " + aName + " to be a vector with 3 coordinates or a spinor with 4 coordinates.");
                }
            }
            else {
                console.warn("Expecting " + aName + " to be a VectorN.");
            }
        }
    };
    return Scaling;
}());
export { Scaling };
