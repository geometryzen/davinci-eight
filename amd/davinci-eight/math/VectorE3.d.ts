/**
 * @class VectorE3
 */
interface VectorE3 {
    /**
     * @property x
     * @type number
     */
    x: number;
    /**
     * @property y
     * @type number
     */
    y: number;
    /**
     * @property z
     * @type number
     */
    z: number;
    /**
     * @method dot
     * @param vector {VectorE3}
     * @return {number}
     */
    dot(vector: VectorE3): number;
}
export = VectorE3;
