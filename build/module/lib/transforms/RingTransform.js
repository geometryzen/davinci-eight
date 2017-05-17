import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeString } from '../checks/mustBeString';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
var RingTransform = (function () {
    /**
     * @param e The axis normal to the plane of the ring.
     * @param cutLine
     * @param clockwise
     * @param a The outer radius.
     * @param b The inner radius.
     * @param aPosition The name to use for the position attribute.
     */
    function RingTransform(e, cutLine, clockwise, a, b, sliceAngle, aPosition, aTangent) {
        this.e = Vector3.copy(e);
        this.innerRadius = mustBeNumber('a', a);
        this.outerRadius = mustBeNumber('b', b);
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle);
        this.generator = Spinor3.dual(e, clockwise);
        this.cutLine = Vector3.copy(cutLine).normalize();
        this.aPosition = mustBeString('aPosition', aPosition);
        this.aTangent = mustBeString('aTangent', aTangent);
    }
    RingTransform.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var uSegments = iLength - 1;
        var u = i / uSegments;
        var vSegments = jLength - 1;
        var v = j / vSegments;
        var b = this.innerRadius;
        var a = this.outerRadius;
        var rotor = this.generator.clone().scale(-this.sliceAngle * u / 2).exp();
        var position = Vector3.copy(this.cutLine).rotate(rotor).scale(b + (a - b) * v);
        var tangent = Spinor3.dual(this.e, false);
        vertex.attributes[this.aPosition] = position;
        vertex.attributes[this.aTangent] = tangent;
    };
    return RingTransform;
}());
export { RingTransform };
