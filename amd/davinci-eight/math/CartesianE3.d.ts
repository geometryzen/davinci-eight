import VectorE3 = require('../math/VectorE3');
/**
 * @class CartesianE3
 */
declare class CartesianE3 implements VectorE3 {
    private coordinates;
    /**
     * A lightweight immutable type representing Cartesian coordinates (in Euclidean space).
     * @class CartesianE3
     * @constructor
     * @param x {number} The <em>x coordinate</em>.
     * @param y {number} The <em>y coordinate</em>.
     * @param z {number} The <em>z coordinate</em>.
     */
    constructor(x: number, y: number, z: number, areYouSure: boolean);
    x: number;
    y: number;
    z: number;
    magnitude(): number;
    squaredNorm(): number;
    /**
     * @property zero
     * @type {CartesianE3}
     * @static
     */
    static zero: CartesianE3;
    /**
     * @property e1
     * @type {CartesianE3}
     * @static
     */
    static e1: CartesianE3;
    /**
     * @property e2
     * @type {CartesianE3}
     * @static
     */
    static e2: CartesianE3;
    /**
     * @property e3
     * @type {CartesianE3}
     * @static
     */
    static e3: CartesianE3;
    /**
     * @method fromVectorE3
     * @param vector {VectorE3}
     * @return {CartesianE3}
     * @static
     */
    static fromVectorE3(vector: {
        x: number;
        y: number;
        z: number;
    }): CartesianE3;
    /**
     * @method direction
     * @param vector {VectorE3}
     * @return {CartesianE3}
     * @static
     */
    static direction(vector: {
        x: number;
        y: number;
        z: number;
    }): CartesianE3;
}
export = CartesianE3;
