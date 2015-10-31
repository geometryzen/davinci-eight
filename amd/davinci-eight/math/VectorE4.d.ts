/**
 * @class VectorE4
 */
interface VectorE4 {
    /**
     * The Cartesian x-coordinate.
     * @property x
     * @type number
     */
    x: number;
    /**
     * The Cartesian y-coordinate.
     * @property y
     * @type number
     */
    y: number;
    /**
     * The Cartesian z-coordinate.
     * @property z
     * @type number
     */
    z: number;
    /**
     * The Cartesian w-coordinate.
     * @property w
     * @type number
     */
    w: number;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    /**
     * The squared norm, as a <code>number</code>.
     */
    squaredNorm(): number;
}
export = VectorE4;
