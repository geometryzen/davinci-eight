import Pseudo = require('../math/Pseudo')
import Scalar = require('../math/Scalar')
import SpinorE2 = require('../math/SpinorE2')
import VectorE2 = require('../math/VectorE2')

/**
 * @class GeometricE2
 * @extends Pseudo
 * @extends Scalar
 * @extends SpinorE2
 * @extends VectorE2
 */
interface GeometricE2 extends Pseudo, Scalar, SpinorE2, VectorE2 {
    /**
     * @method add
     * @param point {GeometricE2}
     * @param [α = 1] {number}
     * @return {GeometricE2}
     */
    add(point: GeometricE2, α?: number): GeometricE2;

    /**
     * @method clone
     * @return {GeometricE2}
     */
    clone(): GeometricE2;

    /**
     * @method distanceTo
     * @param point {GeometricE2}
     * @return {number}
     */
    distanceTo(point: GeometricE2): number;

    /**
     * @method direction
     * @return {GeometricE2}
     */
    direction(): GeometricE2;

    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {GeometricE2}
     * @param endPoint {GeometricE2}
     * @return {GeometricE2}
     */
    quadraticBezier(t: number, controlPoint: GeometricE2, endPoint: GeometricE2): GeometricE2;

    /**
     * @method scale
     * @param α {number}
     * @return GeometricE2
     */
    scale(α: number): GeometricE2;

    /**
     * @method sub
     * @param point {GeometricE2}
     * @param [α = 1] {number}
     * @return {GeometricE2}
     */
    sub(point: GeometricE2, α?: number): GeometricE2;
}

export = GeometricE2;