import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeString } from '../checks/mustBeString';
import { notImplemented } from '../i18n/notImplemented';
import { Spinor2 } from '../math/Spinor2';
import { Spinor3 } from '../math/Spinor3';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
/**
 * Applies a duality transformation to the specified attributes of a vertex, creating a new attribute.
 * The convention used is pre-multiplication by the pseudoscalar.
 */
var Duality = /** @class */ (function () {
    function Duality(sourceName, outputName, changeSign, removeSource) {
        this.sourceName = mustBeString('sourceName', sourceName);
        this.outputName = mustBeString('outputName', outputName);
        this.changeSign = mustBeBoolean('changeSign', changeSign);
        this.removeSource = mustBeBoolean('removeSource', removeSource);
    }
    Duality.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var v = vertex.attributes[this.sourceName];
        if (v) {
            if (v instanceof Vector3) {
                var spinor = Spinor3.dual(v, this.changeSign);
                vertex.attributes[this.outputName] = spinor;
            }
            else if (v instanceof Spinor3) {
                var vector = Vector3.dual(v, this.changeSign);
                vertex.attributes[this.outputName] = vector;
            }
            else if (v instanceof Vector2) {
                throw new Error(notImplemented('dual(vector: Vector2)').message);
            }
            else if (v instanceof Spinor2) {
                throw new Error(notImplemented('dual(spinor: Spinor2)').message);
            }
            else {
                throw new Error("Expecting " + this.sourceName + " to be a Vector3 or Spinor");
            }
            if (this.removeSource) {
                delete vertex.attributes[this.sourceName];
            }
        }
        else {
            throw new Error("Vertex attribute " + this.sourceName + " was not found");
        }
    };
    return Duality;
}());
export { Duality };
