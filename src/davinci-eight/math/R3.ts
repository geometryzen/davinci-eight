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
 * @class R3
 */
export default class R3 implements VectorE3 {
    private _coords: number[];
    private _uom: Unit;

    /**
     * @property zero
     * @type R3
     * @readOnly
     * @static
     */
    public static zero = new R3(0, 0, 0, void 0)

    /**
     * @property e1
     * @type R3
     * @readOnly
     * @static
     */
    public static e1 = new R3(1, 0, 0, void 0)

    /**
     * @property e2
     * @type R3
     * @readOnly
     * @static
     */
    public static e2 = new R3(0, 1, 0, void 0)

    /**
     * @property e3
     * @type R3
     * @readOnly
     * @static
     */
    public static e3 = new R3(0, 0, 1, void 0)

    /**
     * @class R3
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

    magnitude(): number {
        return Math.sqrt(this.squaredNorm())
    }

    /**
     * @method neg
     * @return {Cartesian3}
     */
    neg(): R3 {
        return this.scale(-1);
    }

    scale(α: number): R3 {
        return new R3(α * this.x, α * this.y, α * this.z, this.uom)
    }

    squaredNorm(): number {
        const x = this.x
        const y = this.y
        const z = this.z
        return x * x + y * y + z * z
    }

    /**
     * @method fromVector
     * @param vector {VectorE3}
     * @param [uom] {Unit}
     * @return {R3}
     * @static
     */
    static fromVector(vector: VectorE3, uom?: Unit): R3 {
        return new R3(vector.x, vector.y, vector.z, uom)
    }

    /**
     * @method direction
     * @param vector {VectorE3}
     * @return {R3}
     * @static
     */
    static direction(vector: VectorE3): R3 {
        const x = vector.x
        const y = vector.y
        const z = vector.z
        const m = Math.sqrt(x * x + y * y + z * z)
        return new R3(x / m, y / m, z / m, void 0)
    }
}
