import core from '../core'
import mustBeNumber from '../checks/mustBeNumber'
import readOnly from '../i18n/readOnly'
import Unit from './Unit';
import VectorE3 from './VectorE3'

/**
 * @module EIGHT
 * @submodule math
 */

/**
 * @class CartesianE3
 */
export default class CartesianE3 implements VectorE3 {
    private _coords: number[];
    private _uom: Unit;

    /**
     * @property zero
     * @type CartesianE3
     * @readOnly
     * @static
     */
    public static zero = new CartesianE3(0, 0, 0, void 0)

    /**
     * @property e1
     * @type CartesianE3
     * @readOnly
     * @static
     */
    public static e1 = new CartesianE3(1, 0, 0, void 0)

    /**
     * @property e2
     * @type CartesianE3
     * @readOnly
     * @static
     */
    public static e2 = new CartesianE3(0, 1, 0, void 0)

    /**
     * @property e3
     * @type CartesianE3
     * @readOnly
     * @static
     */
    public static e3 = new CartesianE3(0, 0, 1, void 0)

    /**
     * @class CartesianE3
     * @constructor
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    constructor(x: number, y: number, z: number, uom: Unit) {
        if (core.safemode) {
            mustBeNumber('x', x)
            mustBeNumber('y', y)
            mustBeNumber('z', z)
        }
        this._coords = [x, y, z]
        this._uom = uom
    }
    get x(): number {
        return this._coords[0]
    }
    set x(unused: number) {
        throw new Error(readOnly('x').message)
    }
    get y(): number {
        return this._coords[1]
    }
    set y(unused: number) {
        throw new Error(readOnly('y').message)
    }
    get z(): number {
        return this._coords[2]
    }
    set z(unused: number) {
        throw new Error(readOnly('z').message)
    }
    get uom(): Unit {
        return this._uom
    }
    set uom(unused: Unit) {
        throw new Error(readOnly('uom').message)
    }
    // FIXME: This should return a Unit scaled by the coordinate values.
    magnitude(): number {
        return Math.sqrt(this.squaredNorm())
    }

    /**
     * @method neg
     * @return {Cartesian3}
     */
    neg(): CartesianE3 {
        return this.scale(-1);
    }
    scale(α: number): CartesianE3 {
        return new CartesianE3(α * this.x, α * this.y, α * this.z, this.uom)
    }
    // FIXME: This should return a Unit scaled by the coordinate values.
    squaredNorm(): number {
        const x = this.x
        const y = this.y
        const z = this.z
        return x * x + y * y + z * z
    }
    static fromVectorE3(vector: VectorE3): CartesianE3 {
        return new CartesianE3(vector.x, vector.y, vector.z, vector.uom)
    }
    static direction(vector: VectorE3): CartesianE3 {
        const x = vector.x
        const y = vector.y
        const z = vector.z
        const m = Math.sqrt(x * x + y * y + z * z)
        return new CartesianE3(x / m, y / m, z / m, void 0)
    }
}
