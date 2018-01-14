import { mustBeObject } from '../checks/mustBeObject';
import { Vector3 } from '../math/Vector3';
/**
 * Applies a translation to the specified attributes of a vertex.
 */
var Translation = /** @class */ (function () {
    function Translation(s, names) {
        this.s = Vector3.copy(mustBeObject('s', s));
        this.names = names;
    }
    Translation.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var nLength = this.names.length;
        for (var k = 0; k < nLength; k++) {
            var aName = this.names[k];
            var v = vertex.attributes[aName];
            if (v.length === 3) {
                var vector = Vector3.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2));
                vector.add(this.s);
                vertex.attributes[aName] = vector;
            }
            else {
                throw new Error("Expecting " + aName + " to be a vector with 3 coordinates");
            }
        }
    };
    return Translation;
}());
export { Translation };
