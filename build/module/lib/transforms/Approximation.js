import { mustBeNumber } from '../checks/mustBeNumber';
import { Coords } from '../math/Coords';
import { Geometric2 } from '../math/Geometric2';
import { Geometric3 } from '../math/Geometric3';
import { Spinor2 } from '../math/Spinor2';
import { Spinor3 } from '../math/Spinor3';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
/**
 * A `Transform` that calls the `approx` method on a `Vertex` attribute.
 */
var Approximation = (function () {
    /**
     * @param n The value that will be passed to the `approx` method.
     * @param names The names of the attributes that are affected.
     */
    function Approximation(n, names) {
        this.n = mustBeNumber('n', n);
        this.names = names;
    }
    Approximation.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var nLength = this.names.length;
        for (var k = 0; k < nLength; k++) {
            var aName = this.names[k];
            var v = vertex.attributes[aName];
            if (v instanceof Coords) {
                v.approx(this.n);
            }
            else if (v instanceof Vector3) {
                v.approx(this.n);
            }
            else if (v instanceof Spinor3) {
                v.approx(this.n);
            }
            else if (v instanceof Vector2) {
                v.approx(this.n);
            }
            else if (v instanceof Spinor2) {
                v.approx(this.n);
            }
            else if (v instanceof Geometric2) {
                v.approx(this.n);
            }
            else if (v instanceof Geometric3) {
                v.approx(this.n);
            }
            else {
                throw new Error("Expecting " + aName + " to be a VectorN");
            }
        }
    };
    return Approximation;
}());
export { Approximation };
