/**
 * @class VectorE2
 */
interface VectorE2 {
    /**
     * The Cartesian x-coordinate or <em>abscissa</em>.
     * @property x
     * @type number
     */
    x: number;
    /**
     * The Cartesian y-coordinate or <em>ordinate</em>.
     * @property y
     * @type number
     */
    y: number;
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
export = VectorE2;
