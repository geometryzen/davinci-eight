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
     * @method add
     * @param point {VectorE2}
     * @param α [number = 1]
     * @return {VectorE2}
     */
    add(point: VectorE2, α?: number): VectorE2;
    /**
     * @method clone
     * @return {VectorE2}
     */
    clone(): VectorE2;
    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {VectorE2}
     * @param controlEnd {VectorE2}
     * @param endPoint {VectorE2}
     */
    cubicBezier(t: number, controlBegin: VectorE2, controlEnd: VectorE2, endPoint: VectorE2): VectorE2;
    /**
     * @method distanceTo
     * @param point {VectorE2}
     * @return {number}
     */
    distanceTo(point: VectorE2): number;
    /**
     * @method equals
     * @param point {VectorE2}
     * @return {boolean}
     */
    equals(point: VectorE2): boolean;
    /**
     * @method normalize
     * @return {VectorE2}
     */
    normalize(): VectorE2;
    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {VectorE2}
     * @param endPoint {VectorE2}
     */
    quadraticBezier(t: number, controlPoint: VectorE2, endPoint: VectorE2): VectorE2;
    /**
     * @method scale
     * @param α {number}
     * @return VectorE2
     */
    scale(α: number): VectorE2;
    /**
     * @method sub
     * @param point {VectorE2}
     * @param α [number = 1]
     * @return {VectorE2}
     */
    sub(point: VectorE2, α?: number): VectorE2;
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
