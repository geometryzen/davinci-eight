import isDefined from '../checks/isDefined'
import isObject from '../checks/isObject'
import isNull from '../checks/isNull'
import isNumber from '../checks/isNumber'
import notImplemented from '../i18n/notImplemented'
import mustBeNumber from '../checks/mustBeNumber'
import mustBeObject from '../checks/mustBeObject'
import NormedLinearElement from './NormedLinearElement'
import randomRange from './randomRange';
import readOnly from '../i18n/readOnly'
import SpinorE3 from './SpinorE3'
import stringFromCoordinates from './stringFromCoordinates';
import {Unit} from './Unit';
import VectorE3 from './VectorE3'

const BASIS_LABELS = ['e1', 'e2', 'e3']

/**
 * @module EIGHT
 * @submodule math
 */

/**
 * <p>
 * An immutable vector in Euclidean 3D space supporting a unit of measure.
 * </p>
 * <p>
 * This class is intended to be used for Physical Science education and research by
 * supporting linear algebra applications with units of measure.
 * </p>
 * <p>
 * This class is not intended to be used in high-performance graphics applications
 * owing to the cost of creating temporary objects and unit computation.
 * </p>
 */
export default class R3 implements VectorE3, NormedLinearElement<R3, R3, SpinorE3, VectorE3, Unit, Unit> {

    private _coords: number[];
    private _uom: Unit;
    public static zero = new R3(0, 0, 0, Unit.ONE)
    public static e1 = new R3(1, 0, 0, Unit.ONE)
    public static e2 = new R3(0, 1, 0, Unit.ONE)
    public static e3 = new R3(0, 0, 1, Unit.ONE)

    constructor(x: number, y: number, z: number, uom: Unit) {
        mustBeNumber('x', x)
        mustBeNumber('y', y)
        mustBeNumber('z', z)
        mustBeObject('uom', uom)
        const m = uom.multiplier
        if (m !== 1) {
            this._coords = [m * x, m * y, m * z]
            this._uom = new Unit(1, uom.dimensions, uom.labels)
        }
        else {
            this._coords = [x, y, z]
            this._uom = uom
        }
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

    add(rhs: R3, α = 1): R3 {
        throw new Error(notImplemented('add').message)
    }

    cross(rhs: R3): R3 {
        const uom = this.uom.mul(rhs.uom);
        const x = this.y * rhs.z - this.z * rhs.y;
        const y = this.z * rhs.x - this.x * rhs.z;
        const z = this.x * rhs.y - this.y * rhs.x;
        return new R3(x, y, z, uom);
    }

    divByScalar(α: Unit): R3 {
        return new R3(this.x, this.y, this.z, this.uom.div(α))
    }

    dot(rhs: R3): Unit {
        const uom = this.uom.mul(rhs.uom);
        return uom.scale(this.x * rhs.x + this.y * rhs.y + this.z * rhs.z);
    }

    lerp(target: R3, α: number): R3 {
        throw new Error(notImplemented('lerp').message)
    }

    magnitude(): Unit {
        return this.squaredNorm().sqrt()
    }

    neg(): R3 {
        return new R3(-this.x, -this.y, -this.z, this.uom)
    }

    reflect(n: VectorE3): R3 {
        throw new Error(notImplemented('reflect').message)
    }

    rotate(R: SpinorE3): R3 {
        const x = this.x;
        const y = this.y;
        const z = this.z;

        const a = R.xy;
        const b = R.yz;
        const c = R.zx;
        const w = R.a;

        const ix = w * x - c * z + a * y;
        const iy = w * y - a * x + b * z;
        const iz = w * z - b * y + c * x;
        const iw = b * x + c * y + a * z;

        const ox = ix * w + iw * b + iy * a - iz * c;
        const oy = iy * w + iw * c + iz * b - ix * a;
        const oz = iz * w + iw * a + ix * c - iy * b;

        return new R3(ox, oy, oz, this.uom)
    }

    scale(α: Unit): R3 {
        return new R3(this.x, this.y, this.z, this.uom.mul(α))
    }

    slerp(target: R3, α: number): R3 {
        throw new Error(notImplemented('slerp').message)
    }

    squaredNorm(): Unit {
        const x = this.x
        const y = this.y
        const z = this.z
        return this.uom.quad().scale(x * x + y * y + z * z)
    }

    stress(σ: VectorE3): R3 {
        return R3.vector(this.x * σ.x, this.y * σ.y, this.z * σ.z, this.uom)
    }

    sub(rhs: R3, α = 1): R3 {
        throw new Error(notImplemented('sub').message)
    }

    toStringCustom(coordToString: (x: number) => string, labels: (string | string[])[]): string {
        const quantityString: string = stringFromCoordinates(this._coords, coordToString, labels);
        if (this.uom) {
            const unitString = this.uom.toString().trim();
            if (unitString) {
                return quantityString + ' ' + unitString;
            }
            else {
                return quantityString;
            }
        }
        else {
            return quantityString;
        }
    }

    toExponential(fractionDigits?: number): string {
        const coordToString = function(coord: number): string { return coord.toExponential(fractionDigits) }
        return this.toStringCustom(coordToString, BASIS_LABELS)
    }

    toFixed(fractionDigits?: number): string {
        const coordToString = function(coord: number): string { return coord.toFixed(fractionDigits) }
        return this.toStringCustom(coordToString, BASIS_LABELS)
    }

    toPrecision(precision?: number): string {
        const coordToString = function(coord: number): string { return coord.toPrecision(precision) }
        return this.toStringCustom(coordToString, BASIS_LABELS)
    }

    toString(radix?: number): string {
        const coordToString = function(coord: number): string { return coord.toString(radix) }
        return this.toStringCustom(coordToString, BASIS_LABELS)
    }

    __add__(rhs: VectorE3): R3 {
        if (isObject(rhs) && !isNull(rhs))
            if (isNumber(rhs.x) && isNumber(rhs.y) && isNumber(rhs.z)) {
                return R3.vector(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, this.uom)
            }
            else {
                return void 0
            }
    }

    static fromVector(vector: VectorE3, uom: Unit): R3 {
        return new R3(vector.x, vector.y, vector.z, uom)
    }

    /**
     * <p>
     * Creates a new R3 with the same direction as the supplied vector.
     * </p>
     * <p>
     * If the input is <code>undefined</code> then the output is <code>undefined</code>.
     * </p>
     */
    static direction(vector: VectorE3): R3 {
        if (isDefined(vector)) {
            const x = vector.x
            const y = vector.y
            const z = vector.z
            const m = Math.sqrt(x * x + y * y + z * z)
            return new R3(x / m, y / m, z / m, Unit.ONE)
        }
        else {
            return void 0
        }
    }

    static random(): R3 {
        const x = randomRange(-1, 1);
        const y = randomRange(-1, 1);
        const z = randomRange(-1, 1);
        const m = Math.sqrt(x * x + y * y + z * z);
        return new R3(x / m, y / m, z / m, Unit.ONE);
    }

    static vector(x: number, y: number, z: number, uom: Unit): R3 {
        return new R3(x, y, z, uom)
    }
}
