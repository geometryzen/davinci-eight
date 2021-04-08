import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeString } from '../checks/mustBeString';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
/**
 * @hidden
 */
function coneNormal(ρ, h, out) {
    out.copy(ρ);
    var ρ2 = out.squaredNorm();
    out.add(h, ρ2).divByScalar(Math.sqrt(ρ2) * Math.sqrt(1 + ρ2));
}
/**
 * @hidden
 */
var ConeTransform = /** @class */ (function () {
    /**
     * @param clockwise
     * @param sliceAngle
     * @param aPosition The name to use for the position attribute.
     * @param aTangent The name to use for the tangent plane attribute.
     */
    function ConeTransform(clockwise, sliceAngle, aPosition, aTangent) {
        /**
         * The vector from the base of the cone to the apex.
         * The default is e2.
         */
        this.h = Vector3.vector(0, 1, 0);
        /**
         * The radius vector and the initial direction for a slice.
         * The default is e3.
         */
        this.a = Vector3.vector(0, 0, 1);
        /**
         * The perpendicular radius vector.
         * We compute this so that the grid wraps around the cone with
         * u increasing with θ and v increasing toward the apex of the cone.
         * The default is e1.
         */
        this.b = Vector3.vector(1, 0, 0);
        this.clockwise = mustBeBoolean('clockwise', clockwise);
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle);
        this.aPosition = mustBeString('aPosition', aPosition);
        this.aTangent = mustBeString('aTangent', aTangent);
    }
    /**
     *
     * @param vertex (output)
     * @param i (input)
     * @param j (input)
     * @param iLength (input)
     * @param jLength (input)
     */
    ConeTransform.prototype.exec = function (vertex, i, j, iLength, jLength) {
        // Let e be the unit vector in the symmetry axis of the cone.
        // Let ρ be a point on the base of the cone.
        // Then the normal to the cone n is given by
        //
        // n = (ρ * ρ * e + ρ) / (|ρ| * sqrt(1 + ρ * ρ))
        //
        // This formula is derived by finding the vector in the plane of e and ρ
        // that is normal to the vector (e - ρ) and normalized to unity.
        // The formula always gives a formula that is well defined provided |ρ| is non-zero.
        //
        // In order to account for the stress and tilt operations, compute the normal using
        // the transformed ρ and h
        var uSegments = iLength - 1;
        var u = i / uSegments;
        var vSegments = jLength - 1;
        var v = j / vSegments;
        var sign = this.clockwise ? -1 : +1;
        var θ = sign * this.sliceAngle * u;
        var cosθ = Math.cos(θ);
        var sinθ = Math.sin(θ);
        /**
         * Point on the base of the cone.
         */
        var ρ = new Vector3().add(this.a, cosθ).add(this.b, sinθ);
        /**
         * Point on the standard cone at uIndex, vIndex.
         */
        var x = Vector3.lerp(ρ, this.h, v);
        vertex.attributes[this.aPosition] = x;
        var normal = Vector3.zero();
        coneNormal(ρ, this.h, normal);
        vertex.attributes[this.aTangent] = Spinor3.dual(normal, true);
    };
    return ConeTransform;
}());
export { ConeTransform };
