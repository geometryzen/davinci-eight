/**
 * @class VectorE1
 */
interface VectorE1 {
    /**
     * The Cartesian x-coordinate.
     * @property x
     * @type number
     */
    x: number;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    /**
     * The squared norm.
     */
    squaredNorm(): number;
}
export = VectorE1;
