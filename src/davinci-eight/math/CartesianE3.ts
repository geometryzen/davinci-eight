import mustBeNumber = require('../checks/mustBeNumber')
import readOnly = require('../i18n/readOnly')
import VectorE3 = require('../math/VectorE3')

var zero: CartesianE3;
var e1: CartesianE3;
var e2: CartesianE3;
var e3: CartesianE3;

/**
 * @class CartesianE3
 */
class CartesianE3 implements VectorE3 {
    private coordinates: number[];
    /**
     * A lightweight immutable type representing Cartesian coordinates (in Euclidean space).
     * @class CartesianE3
     * @constructor
     * @param x {number} The <em>x coordinate</em>.
     * @param y {number} The <em>y coordinate</em>.
     * @param z {number} The <em>z coordinate</em>.
     */
    constructor(x: number, y: number, z: number, areYouSure: boolean) {
        mustBeNumber('x', x)
        mustBeNumber('y', y)
        mustBeNumber('z', z)
        this.coordinates = [x, y, z]
        if (!areYouSure) {
            console.warn("Try constructing CartesianE3 from geometric static methods.")
        }
    }
    get x(): number {
        return this.coordinates[0]
    }
    set x(unused) {
        throw new Error(readOnly('x').message)
    }
    get y(): number {
        return this.coordinates[1]
    }
    set y(unused) {
        throw new Error(readOnly('y').message)
    }
    get z(): number {
        return this.coordinates[2]
    }
    set z(unused) {
        throw new Error(readOnly('z').message)
    }
    magnitude(): number {
        return Math.sqrt(this.squaredNorm())
    }
    squaredNorm(): number {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        return x * x + y * y + z * z;
    }

    /**
     * @property zero
     * @type {CartesianE3}
     * @static
     */
    static get zero(): CartesianE3 { return zero }

    /**
     * @property e1
     * @type {CartesianE3}
     * @static
     */
    static get e1(): CartesianE3 { return e1 }

    /**
     * @property e2
     * @type {CartesianE3}
     * @static
     */
    static get e2(): CartesianE3 { return e2 }

    /**
     * @property e3
     * @type {CartesianE3}
     * @static
     */
    static get e3(): CartesianE3 { return e3 }

    /**
     * @method fromVectorE3
     * @param vector {VectorE3}
     * @return {CartesianE3}
     * @static
     */
    static fromVectorE3(vector: { x: number, y: number, z: number }): CartesianE3 {
        return new CartesianE3(vector.x, vector.y, vector.z, true)
    }
    /**
     * @method normalize
     * @param vector {VectorE3}
     * @return {CartesianE3}
     * @static
     */
    static normalize(vector: { x: number, y: number, z: number }): CartesianE3 {
        let x = vector.x;
        let y = vector.y;
        let z = vector.z;
        let m = Math.sqrt(x * x + y * y + z * z)
        return new CartesianE3(x / m, y / m, z / m, true)
    }
}

zero = new CartesianE3(0, 0, 0, true)
e1 = new CartesianE3(1, 0, 0, true)
e2 = new CartesianE3(0, 1, 0, true)
e3 = new CartesianE3(0, 0, 1, true)

export = CartesianE3;