import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeString } from '../checks/mustBeString';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
/**
 * @hidden
 */
var CylinderTransform = /** @class */ (function () {
    /**
     * @param sliceAngle
     * @param aPosition The name to use for the position attribute.
     * @param aTangent The name to use for the tangent plane attribute.
     */
    function CylinderTransform(height, cutLine, clockwise, sliceAngle, orientation, aPosition, aTangent) {
        this.height = Vector3.copy(height);
        this.cutLine = Vector3.copy(cutLine);
        this.generator = Spinor3.dual(this.height.clone().normalize(), !clockwise);
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle);
        this.orientation = mustBeNumber('orientation', orientation);
        this.aPosition = mustBeString('aPosition', aPosition);
        this.aTangent = mustBeString('aTangent', aTangent);
    }
    CylinderTransform.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var uSegments = iLength - 1;
        var u = i / uSegments;
        var vSegments = jLength - 1;
        var v = j / vSegments;
        var rotor = this.generator.clone().scale(-this.sliceAngle * u / 2).exp();
        /**
         * Point on the wall of the cylinder, initially with no vertical component.
         */
        var ρ = Vector3.copy(this.cutLine).rotate(rotor);
        vertex.attributes[this.aPosition] = ρ.clone().add(this.height, v);
        vertex.attributes[this.aTangent] = Spinor3.dual(ρ, true).scale(this.orientation);
    };
    return CylinderTransform;
}());
export { CylinderTransform };
