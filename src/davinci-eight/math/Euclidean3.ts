import addE3 from '../math/addE3';
import b2 from '../geometries/b2';
import b3 from '../geometries/b3';
import extG3 from '../math/extG3';
import GeometricE3 from '../math/GeometricE3';
import lcoG3 from '../math/lcoG3';
import GeometricOperators from '../math/GeometricOperators';
import ImmutableMeasure from '../math/ImmutableMeasure';
import mulG3 from '../math/mulG3';
import gauss from './gauss';
import GeometricElement from '../math/GeometricElement';
import notImplemented from '../i18n/notImplemented';
import quadSpinorE3 from './quadSpinorE3'
import rcoG3 from '../math/rcoG3';
import readOnly from '../i18n/readOnly';
import scpG3 from '../math/scpG3';
import SpinorE3 from '../math/SpinorE3';
import squaredNormG3 from '../math/squaredNormG3';
import stringFromCoordinates from '../math/stringFromCoordinates';
import subE3 from '../math/subE3';
import TrigMethods from '../math/TrigMethods';
import Unit from '../math/Unit';
import VectorE3 from '../math/VectorE3';
import BASIS_LABELS_G3_GEOMETRIC from '../math/BASIS_LABELS_G3_GEOMETRIC';
import BASIS_LABELS_G3_HAMILTON from '../math/BASIS_LABELS_G3_HAMILTON';
import BASIS_LABELS_G3_STANDARD from '../math/BASIS_LABELS_G3_STANDARD';
import BASIS_LABELS_G3_STANDARD_HTML from '../math/BASIS_LABELS_G3_STANDARD_HTML';

/**
 * @module EIGHT
 * @submodule math
 */

const COORD_SCALAR = 0
const COORD_X = 1
const COORD_Y = 2
const COORD_Z = 3
const COORD_XY = 4
const COORD_YZ = 5
const COORD_ZX = 6
const COORD_PSEUDO = 7

function compute(
    f: (x0: number, x1: number, x2: number, x3: number, x4: number, x5: number, x6: number, x7: number, y0: number, y1: number, y2: number, y3: number, y4: number, y5: number, y6: number, y7: number, index: number) => number,
    a: number[],
    b: number[],
    coord: (m: number[], index: number) => number,
    pack: (x0: number, x1: number, x2: number, x3: number, x4: number, x5: number, x6: number, x7: number, uom: Unit) => Euclidean3,
    uom: Unit): Euclidean3 {
    var a0 = coord(a, 0);
    var a1 = coord(a, 1);
    var a2 = coord(a, 2);
    var a3 = coord(a, 3);
    var a4 = coord(a, 4);
    var a5 = coord(a, 5);
    var a6 = coord(a, 6);
    var a7 = coord(a, 7);
    var b0 = coord(b, 0);
    var b1 = coord(b, 1);
    var b2 = coord(b, 2);
    var b3 = coord(b, 3);
    var b4 = coord(b, 4);
    var b5 = coord(b, 5);
    var b6 = coord(b, 6);
    var b7 = coord(b, 7);
    var x0 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
    var x1 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
    var x2 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
    var x3 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
    var x4 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
    var x5 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
    var x6 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
    var x7 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
    return pack(x0, x1, x2, x3, x4, x5, x6, x7, uom);
}

/**
 * @class Euclidean3
 */
export default class Euclidean3 implements ImmutableMeasure<Euclidean3>, GeometricE3, GeometricElement<Euclidean3, Euclidean3, SpinorE3, VectorE3>, GeometricOperators<Euclidean3>, TrigMethods<Euclidean3> {
    static get BASIS_LABELS_GEOMETRIC(): string[][] { return BASIS_LABELS_G3_GEOMETRIC };
    static get BASIS_LABELS_HAMILTON(): string[][] { return BASIS_LABELS_G3_HAMILTON };
    static get BASIS_LABELS_STANDARD(): string[][] { return BASIS_LABELS_G3_STANDARD };
    static get BASIS_LABELS_STANDARD_HTML(): string[][] { return BASIS_LABELS_G3_STANDARD_HTML };

    /**
     * @property BASIS_LABELS
     * @type {string[][]}
     */
    static BASIS_LABELS: string[][] = BASIS_LABELS_G3_STANDARD

    /**
     * @property zero
     * @type {Euclidean3}
     * @static
     */
    public static zero = new Euclidean3(0, 0, 0, 0, 0, 0, 0, 0);

    /**
     * @property one
     * @type {Euclidean3}
     * @static
     */
    public static one = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0);

    /**
     * @property e1
     * @type {Euclidean3}
     * @static
     */
    public static e1 = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);

    /**
     * @property e2
     * @type {Euclidean3}
     * @static
     */
    public static e2 = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);

    /**
     * @property e3
     * @type {Euclidean3}
     * @static
     */
    public static e3 = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);

    /**
     * @property kilogram
     * @type {Euclidean3}
     * @static
     */
    public static kilogram = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KILOGRAM);

    /**
     * @property meter
     * @type {Euclidean3}
     * @static
     */
    public static meter = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.METER);

    /**
     * @property second
     * @type {Euclidean3}
     * @static
     */
    public static second = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.SECOND);

    /**
     * @property coulomb
     * @type {Euclidean3}
     * @static
     */
    public static coulomb = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.COULOMB);

    /**
     * @property ampere
     * @type {Euclidean3}
     * @static
     */
    public static ampere = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.AMPERE);

    /**
     * @property kelvin
     * @type {Euclidean3}
     * @static
     */
    public static kelvin = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.KELVIN);

    /**
     * @property mole
     * @type {Euclidean3}
     * @static
     */
    public static mole = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.MOLE);

    /**
     * @property candela
     * @type {Euclidean3}
     * @static
     */
    public static candela = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.CANDELA);

    /**
     * The coordinate values are stored in a number array.
     * This should be convenient and efficient for tensor calculations.
     *
     * @property _coords
     * @type number[]
     * @private
     */
    private _coords: number[] = [0, 0, 0, 0, 0, 0, 0, 0]

    /**
     * The optional unit of measure.
     * @property uom
     * @type Unit
     */
    public uom: Unit;
    /**
     * The Euclidean3 class represents a multivector for a 3-dimensional vector space with a Euclidean metric.
     * Constructs a Euclidean3 from its coordinates.
     * @constructor
     * @param {number} α The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} z The vector component of the multivector in the z-direction.
     * @param {number} xy The bivector component of the multivector in the xy-plane.
     * @param {number} yz The bivector component of the multivector in the yz-plane.
     * @param {number} zx The bivector component of the multivector in the zx-plane.
     * @param {number} β The pseudoscalar part of the multivector.
     * @param [uom] The optional unit of measure.
     */
    constructor(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom?: Unit) {
        this._coords[COORD_SCALAR] = α
        this._coords[COORD_X] = x
        this._coords[COORD_Y] = y
        this._coords[COORD_Z] = z
        this._coords[COORD_XY] = xy
        this._coords[COORD_YZ] = yz
        this._coords[COORD_ZX] = zx
        this._coords[COORD_PSEUDO] = β
        this.uom = uom
        if (this.uom && this.uom.multiplier !== 1) {
            var multiplier: number = this.uom.multiplier;
            this._coords[COORD_SCALAR] *= multiplier;
            this._coords[COORD_X] *= multiplier;
            this._coords[COORD_Y] *= multiplier;
            this._coords[COORD_Z] *= multiplier;
            this._coords[COORD_XY] *= multiplier;
            this._coords[COORD_YZ] *= multiplier;
            this._coords[COORD_ZX] *= multiplier;
            this._coords[COORD_PSEUDO] *= multiplier;
            this.uom = new Unit(1, uom.dimensions, uom.labels);
        }
    }

    /**
     * The scalar part of this multivector.
     * @property α
     * @return {number}
     */
    get α(): number {
        return this._coords[COORD_SCALAR]
    }
    set α(unused) {
        throw new Error(readOnly('α').message)
    }

    /**
     * The scalar part of this multivector.
     * @property alpha
     * @return {number}
     */
    get alpha(): number {
        return this._coords[COORD_SCALAR]
    }
    set alpha(unused) {
        throw new Error(readOnly('alpha').message)
    }

    /**
     * The Cartesian coordinate corresponding to the <b>e<sub>1</sub></b> basis vector.
     *
     * @property x
     * @type number
     */
    get x(): number {
        return this._coords[COORD_X]
    }
    set x(unused: number) {
        throw new Error(readOnly('x').message)
    }

    /**
     * The Cartesian coordinate corresponding to the <b>e<sub>2</sub></b> basis vector.
     *
     * @property y
     * @type number
     */
    get y(): number {
        return this._coords[COORD_Y]
    }
    set y(unused: number) {
        throw new Error(readOnly('y').message)
    }

    /**
     * The Cartesian coordinate corresponding to the <b>e<sub>3</sub></b> basis vector.
     *
     * @property z
     * @type number
     */
    get z(): number {
        return this._coords[COORD_Z]
    }
    set z(unused: number) {
        throw new Error(readOnly('z').message)
    }

    /**
     * The coordinate corresponding to the <b>e<sub>1</sub>e<sub>2</sub></b> basis bivector.
     *
     * @property xy
     * @type number
     */
    get xy(): number {
        return this._coords[COORD_XY]
    }
    set xy(unused: number) {
        throw new Error(readOnly('xy').message)
    }

    /**
     * The coordinate corresponding to the <b>e<sub>2</sub>e<sub>3</sub></b> basis bivector.
     *
     * @property yz
     * @type number
     */
    get yz(): number {
        return this._coords[COORD_YZ]
    }
    set yz(unused: number) {
        throw new Error(readOnly('yz').message)
    }

    /**
     * The coordinate corresponding to the <b>e<sub>3</sub>e<sub>1</sub></b> basis bivector.
     *
     * @property zx
     * @type number
     */
    get zx(): number {
        return this._coords[COORD_ZX]
    }
    set zx(unused: number) {
        throw new Error(readOnly('zx').message)
    }

    /**
     * The coordinate corresponding to the <b>e<sub>1</sub>e<sub>2</sub>e<sub>3</sub></b> basis trivector.
     * The pseudoscalar coordinate of this multivector.
     *
     * @property β
     * @return {number}
     */
    get β(): number {
        return this._coords[COORD_PSEUDO]
    }
    set β(unused) {
        throw new Error(readOnly('β').message)
    }

    /**
     * The coordinate corresponding to the <b>e<sub>1</sub>e<sub>2</sub>e<sub>3</sub></b> basis trivector.
     * The pseudoscalar coordinate of this multivector.
     *
     * @property beta
     * @return {number}
     */
    get beta(): number {
        return this._coords[COORD_PSEUDO]
    }
    set beta(unused: number) {
        throw new Error(readOnly('beta').message)
    }

    /**
     * @method fromCartesian
     * @param α {number}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param xy {number}
     * @param yz {number}
     * @param zx {number}
     * @param β {number}
     * @param uom [Unit]
     * @return {Euclidean3}
     * @chainable
     * @static
     */
    static fromCartesian(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom: Unit): Euclidean3 {
        return new Euclidean3(α, x, y, z, xy, yz, zx, β, uom)
    }

    /**
     * @property coords
     * @type {number[]}
     */
    get coords(): number[] {
        return [this.α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β];
    }

    /**
     * @method coordinate
     * @param index {number}
     * @return {number}
     */
    coordinate(index: number): number {
        switch (index) {
            case 0:
                return this.α;
            case 1:
                return this.x;
            case 2:
                return this.y;
            case 3:
                return this.z;
            case 4:
                return this.xy;
            case 5:
                return this.yz;
            case 6:
                return this.zx;
            case 7:
                return this.β;
            default:
                throw new Error("index must be in the range [0..7]");
        }
    }

    /**
     * Computes the sum of this Euclidean3 and another considered to be the rhs of the binary addition, `+`, operator.
     * This method does not change this Euclidean3.
     * @method add
     * @param rhs {Euclidean3}
     * @return {Euclidean3} This Euclidean3 plus rhs.
     */
    add(rhs: Euclidean3): Euclidean3 {
        var coord = function(x: number[], n: number): number {
            return x[n];
        };
        var pack = function(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom: Unit): Euclidean3 {
            return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
        };
        return compute(addE3, this.coords, rhs.coords, coord, pack, Unit.compatible(this.uom, rhs.uom));
    }

    /**
     * Computes <code>this + Iβ</code>
     * @method addPseudo
     * @param β {number}
     * @return {Euclidean3} <code>this</code>
     * @chainable
     */
    addPseudo(β: number): Euclidean3 {
        return new Euclidean3(this.α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β + β, this.uom)
    }

    /**
     * Computes <code>this + α</code>
     * @method addScalar
     * @param α {number}
     * @return {Euclidean3} <code>this</code>
     * @chainable
     */
    addScalar(α: number): Euclidean3 {
        return new Euclidean3(this.α + α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β, this.uom)
    }

    /**
     * @method __add__
     * @param rhs {number | Euclidean3}
     * @return {Euclidean3}
     * @private
     */
    __add__(rhs: number | Euclidean3): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.add(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.addScalar(rhs);
        }
    }

    /**
     * @method __radd__
     * @param lhs {number | Euclidean3}
     * @return {Euclidean3}
     * @private
     */
    __radd__(lhs: number | Euclidean3): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.add(this)
        }
        else if (typeof lhs === 'number') {
            return this.addScalar(lhs)
        }
    }

    /**
     * @method adj
     * @return {Euclidean3}
     * @chainable
     * @beta
     */
    adj(): Euclidean3 {
        throw new Error(notImplemented('adj').message)
    }

    /**
     * @method angle
     * @return {Euclidean3}
     */
    angle(): Euclidean3 {
        return this.log().grade(2);
    }

    /**
     * Computes the <e>Clifford conjugate</em> of this multivector.
     * The grade multiplier is -1<sup>x(x+1)/2</sup>
     * @method conj
     * @return {Euclidean3}
     * @chainable
     */
    conj(): Euclidean3 {
        return new Euclidean3(this.α, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.β, this.uom);
    }

    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {GeometricE3}
     * @param controlEnd {GeometricE3}
     * @param endPoint {GeometricE3}
     * @return {Euclidean3}
     * @chainable
     */
    cubicBezier(t: number, controlBegin: GeometricE3, controlEnd: GeometricE3, endPoint: GeometricE3) {
        let x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
        let y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
        let z = b3(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
        return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
    }

    /**
     * @method direction
     * @return {Euclidean3}
     */
    direction(): Euclidean3 {
        return this.div(this.norm());
    }

    /**
     * @method sub
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    sub(rhs: Euclidean3): Euclidean3 {
        var coord = function(x: number[], n: number): number {
            return x[n];
        };
        var pack = function(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom: Unit): Euclidean3 {
            return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
        };
        return compute(subE3, this.coords, rhs.coords, coord, pack, Unit.compatible(this.uom, rhs.uom));
    }

    /**
     * @method __sub__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __sub__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.sub(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.addScalar(-rhs);
        }
    }


    /**
     * @method __rsub__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rsub__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.sub(this)
        }
        else if (typeof lhs === 'number') {
            return this.neg().addScalar(lhs)
        }
    }

    /**
     * @method mul
     * @param rhs {Euclidean3}
     */
    mul(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
        mulG3(this, rhs, Euclidean3.mutator(out));
        return out;
    }

    /**
     * @method __mul__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __mul__(rhs: any): any {
        if (rhs instanceof Euclidean3) {
            return this.mul(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.scale(rhs);
        }
    }

    /**
     * @method __rmul__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rmul__(lhs: any): any {
        if (lhs instanceof Euclidean3) {
            return lhs.mul(this);
        }
        else if (typeof lhs === 'number') {
            return this.scale(lhs);
        }
    }

    /**
     * @method scale
     * @param α {number}
     * @return {Euclidean3}
     */
    scale(α: number): Euclidean3 {
        return new Euclidean3(this.α * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.β * α, this.uom);
    }

    /**
     * @method div
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    div(rhs: Euclidean3): Euclidean3 {
        return this.mul(rhs.inv())
    }

    /**
     * @method divByScalar
     * @param α {number}
     * @return {Euclidean3}
     */
    divByScalar(α: number): Euclidean3 {
        return new Euclidean3(this.α / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.β / α, this.uom);
    }

    /**
     * @method __div__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __div__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.div(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.divByScalar(rhs);
        }
    }

    /**
     * @method __rdiv__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rdiv__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.div(this);
        }
        else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
        }
    }

    /**
     * @method dual
     * @return {Euclidean3}
     * @beta
     */
    dual(): Euclidean3 {
        throw new Error(notImplemented('dual').message)
    }

    /**
     * @method scp
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    scp(rhs: Euclidean3): Euclidean3 {
        var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
        scpG3(this, rhs, Euclidean3.mutator(out));
        return out;
    }

    /**
     * @method ext
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    ext(rhs: Euclidean3): Euclidean3 {
        const out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom));
        extG3(this, rhs, Euclidean3.mutator(out));
        return out;
    }

    /**
     * @method __vbar__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __vbar__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.scp(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.scp(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    /**
     * @method __rvbar__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rvbar__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.scp(this)
        }
        else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
        }
    }

    /**
     * @method __wedge__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __wedge__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.ext(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.scale(rhs)
        }
    }

    /**
     * @method __rwedge__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rwedge__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.ext(this)
        }
        else if (typeof lhs === 'number') {
            return this.scale(lhs)
        }
    }

    /**
     * @method lco
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    lco(rhs: Euclidean3): Euclidean3 {
        const out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        lcoG3(this, rhs, Euclidean3.mutator(out))
        return out
    }

    /**
     * @method __lshift__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __lshift__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.lco(rhs)
        }
        else if (typeof rhs === 'number') {
            return this.lco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    /**
     * @method __rlshift__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rlshift__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.lco(this)
        }
        else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
        }
    }

    /**
     * @method rco
     * @param rhs {Euclidean3}
     * @return {Euclidean3}
     */
    rco(rhs: Euclidean3): Euclidean3 {
        const out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, rhs.uom))
        rcoG3(this, rhs, Euclidean3.mutator(out))
        return out
    }

    /**
     * @method __rshift__
     * @param rhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rshift__(rhs: any): Euclidean3 {
        if (rhs instanceof Euclidean3) {
            return this.rco(rhs)
        }
        else if (typeof rhs === 'number') {
            return this.rco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
        }
    }

    /**
     * @method __rrshift__
     * @param lhs {any}
     * @return {Euclidean3}
     * @private
     */
    __rrshift__(lhs: any): Euclidean3 {
        if (lhs instanceof Euclidean3) {
            return lhs.rco(this)
        }
        else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
        }
    }

    /**
     * @method pow
     * @param exponent {Euclidean3}
     * @return {Euclidean3}
     * @beta
     */
    pow(exponent: Euclidean3): Euclidean3 {
        throw new Error('pow');
    }

    /**
     * @method __bang__
     * @return {Euclidean3}
     * @private
     */
    __bang__(): Euclidean3 {
        return this.inv()
    }

    /**
     * Unary plus(+).
     * @method __pos__
     * @return {Euclidean3}
     * @private
     */
    __pos__(): Euclidean3 {
        return this;
    }

    /**
     * @method neg
     * @return {Euclidean3} <code>-1 * this</code>
     */
    neg(): Euclidean3 {
        return new Euclidean3(-this.α, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.β, this.uom);
    }
    /**
     * Unary minus (-).
     * @method __neg__
     * @return {Euclidean3}
     * @private
     */
    __neg__(): Euclidean3 {
        return this.neg()
    }

    /**
     * @method rev
     * @return {Euclidean3}
     */
    rev(): Euclidean3 {
        return new Euclidean3(this.α, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.β, this.uom);
    }

    /**
     * ~ (tilde) produces reversion.
     * @method __tilde__
     * @return {Euclidean3}
     * @private
     */
    __tilde__(): Euclidean3 {
        return this.rev();
    }

    /**
     * @method grade
     * @param grade {number}
     * @return {Euclidean3}
     */
    grade(grade: number): Euclidean3 {
        switch (grade) {
            case 0:
                return Euclidean3.fromCartesian(this.α, 0, 0, 0, 0, 0, 0, 0, this.uom);
            case 1:
                return Euclidean3.fromCartesian(0, this.x, this.y, this.z, 0, 0, 0, 0, this.uom);
            case 2:
                return Euclidean3.fromCartesian(0, 0, 0, 0, this.xy, this.yz, this.zx, 0, this.uom);
            case 3:
                return Euclidean3.fromCartesian(0, 0, 0, 0, 0, 0, 0, this.β, this.uom);
            default:
                return Euclidean3.fromCartesian(0, 0, 0, 0, 0, 0, 0, 0, this.uom);
        }
    }

    /**
     * Intentionally undocumented
     */
    /*
    dot(vector: Euclidean3): number {
      return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }
    */

    /**
     * @method cross
     * @param vector {Euclidean3}
     * @return {Euclidean3}
     */
    cross(vector: Euclidean3): Euclidean3 {
        var x: number;
        var x1: number;
        var x2: number;
        var y: number;
        var y1: number;
        var y2: number;
        var z: number;
        var z1: number;
        var z2: number;

        x1 = this.x;
        y1 = this.y;
        z1 = this.z;
        x2 = vector.x;
        y2 = vector.y;
        z2 = vector.z;
        x = y1 * z2 - z1 * y2;
        y = z1 * x2 - x1 * z2;
        z = x1 * y2 - y1 * x2;
        return new Euclidean3(0, x, y, z, 0, 0, 0, 0, Unit.mul(this.uom, vector.uom));
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        return (this.α === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.β === 0);
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return (this.α === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.β === 0);
    }

    /**
     * @method lerp
     * @param target {Euclidean3}
     * @param α {number}
     * @return {Euclidean3}
     */
    lerp(target: Euclidean3, α: number): Euclidean3 {
        throw new Error(notImplemented('lerp').message)
    }

    /**
     * @method cos
     * @return {Euclidean3}
     */
    cos(): Euclidean3 {
        // TODO: Generalize to full multivector.
        Unit.assertDimensionless(this.uom)
        const cosW = Math.cos(this.α)
        return new Euclidean3(cosW, 0, 0, 0, 0, 0, 0, 0)
    }

    /**
     * @method cosh
     * @return {Euclidean3}
     */
    cosh(): Euclidean3 {
        throw new Error(notImplemented('cosh').message)
    }

    /**
     * @method distanceTo
     * @param point {Euclidean3}
     * @return {number}
     */
    distanceTo(point: Euclidean3): number {
        // TODO: Should this be generalized to all coordinates?
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        const dz = this.z - point.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * @method equals
     * @param other {Euclidean3}
     * @return {boolean}
     */
    equals(other: Euclidean3): boolean {
        if (this.α === other.α && this.x === other.x && this.y === other.y && this.z === other.z && this.xy === other.xy && this.yz === other.yz && this.zx === other.zx && this.β === other.β) {
            if (this.uom) {
                if (other.uom) {
                    // TODO: We need equals on
                    return true
                }
                else {
                    return false
                }
            }
            else {
                if (other.uom) {
                    return false
                }
                else {
                    return true
                }
            }
        }
        else {
            return false
        }
    }

    /**
     * @method exp
     * @return {Euclidean3}
     */
    exp(): Euclidean3 {
        Unit.assertDimensionless(this.uom);
        var bivector = this.grade(2);
        var a = bivector.norm();
        if (!a.isZero()) {
            var c = a.cos();
            var s = a.sin();
            var B = bivector.direction();
            return c.add(B.mul(s));
        }
        else {
            return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
        }
    }

    /**
     * Computes the <em>inverse</em> of this multivector, if it exists.
     * @method inv
     * @return {Euclidean3}
     */
    inv(): Euclidean3 {

        const α = this.α
        const x = this.x
        const y = this.y
        const z = this.z
        const xy = this.xy
        const yz = this.yz
        const zx = this.zx
        const β = this.β

        const A = [
            [α, x, y, z, -xy, -yz, -zx, -β],
            [x, α, xy, -zx, -y, -β, z, -yz],
            [y, -xy, α, yz, x, -z, -β, -zx],
            [z, zx, -yz, α, -β, y, -x, -xy],
            [xy, -y, x, β, α, zx, -yz, z],
            [yz, β, -z, y, -zx, α, xy, x],
            [zx, z, β, -x, yz, -xy, α, y],
            [β, yz, zx, xy, z, x, y, α]
        ]

        const b = [1, 0, 0, 0, 0, 0, 0, 0]

        const X = gauss(A, b)

        const uom = this.uom ? this.uom.inv() : void 0
        return new Euclidean3(X[0], X[1], X[2], X[3], X[4], X[5], X[6], X[7], uom);
    }

    /**
     * @method log
     * @return {Euclidean3}
     */
    log(): Euclidean3 {
        throw new Error(notImplemented('log').message)
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {Euclidean3}
     */
    magnitude(): Euclidean3 {
        return this.norm();
    }

    magnitudeSansUnits(): number {
        return Math.sqrt(this.squaredNormSansUnits())
    }

    /**
     * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
     * @method norm
     * @return {Euclidean3}
     */
    norm(): Euclidean3 {
        return new Euclidean3(this.magnitudeSansUnits(), 0, 0, 0, 0, 0, 0, 0, this.uom)
    }

    /**
     * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
     * @method quad
     * @return {Euclidean3}
     */
    quad(): Euclidean3 {
        return this.squaredNorm();
    }

    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {GeometricE3}
     * @param endPoint {GeometricE3}
     * @return {Euclidean3}
     */
    quadraticBezier(t: number, controlPoint: GeometricE3, endPoint: GeometricE3) {
        let x = b2(t, this.x, controlPoint.x, endPoint.x);
        let y = b2(t, this.y, controlPoint.y, endPoint.y);
        let z = b2(t, this.z, controlPoint.z, endPoint.z);
        return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
    }

    /**
     * @method squaredNorm
     * @return {Euclidean3}
     */
    squaredNorm(): Euclidean3 {
        return new Euclidean3(this.squaredNormSansUnits(), 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, this.uom));
    }

    squaredNormSansUnits(): number {
        return squaredNormG3(this);
    }

    /**
     * Computes the <em>reflection</em> of this multivector in the plane with normal <code>n</code>.
     * @method reflect
     * @param n {VectorE3}
     * @return {Euclidean3}
     */
    reflect(n: VectorE3): Euclidean3 {
        // TODO: Optimize to minimize object creation and increase performance.
        let m = Euclidean3.fromVectorE3(n)
        return m.mul(this).mul(m).scale(-1)
    }

    /**
     * @method rotate
     * @param R {SpinorE3}
     * @return {Euclidean3}
     */
    rotate(R: SpinorE3): Euclidean3 {
        // FIXME: This only rotates the vector components.
        // The units may be suspect to if rotate is not clearly defined.
        const x = this.x;
        const y = this.y;
        const z = this.z;

        const a = R.xy;
        const b = R.yz;
        const c = R.zx;
        const α = R.α;
        const quadR = quadSpinorE3(R)

        const ix = α * x - c * z + a * y;
        const iy = α * y - a * x + b * z;
        const iz = α * z - b * y + c * x;
        const iα = b * x + c * y + a * z;

        const αOut = quadR * this.α
        const xOut = ix * α + iα * b + iy * a - iz * c;
        const yOut = iy * α + iα * c + iz * b - ix * a;
        const zOut = iz * α + iα * a + ix * c - iy * b;
        const βOut = quadR * this.β

        return Euclidean3.fromCartesian(αOut, xOut, yOut, zOut, 0, 0, 0, βOut, this.uom)
    }

    /**
     * @method sin
     * @return {Euclidean3}
     */
    sin(): Euclidean3 {
        // TODO: Generalize to full multivector.
        Unit.assertDimensionless(this.uom);
        const sinW = Math.sin(this.α);
        return new Euclidean3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
    }

    /**
     * @method sinh
     * @return {Euclidean3}
     */
    sinh(): Euclidean3 {
        throw new Error(notImplemented('sinh').message)
    }

    /**
     * @method slerp
     * @param target {Euclidean3}
     * @param α {number}
     * @return {Euclidean3}
     */
    slerp(target: Euclidean3, α: number): Euclidean3 {
        throw new Error(notImplemented('slerp').message)
    }

    /**
     * @method sqrt
     * @return {Euclidean3}
     */
    sqrt() {
        return new Euclidean3(Math.sqrt(this.α), 0, 0, 0, 0, 0, 0, 0, Unit.sqrt(this.uom));
    }

    /**
     * @method tan
     * @return {Euclidean3}
     */
    tan(): Euclidean3 {
        return this.sin().div(this.cos())
    }

    /**
     * Intentionally undocumented.
     */
    toStringCustom(coordToString: (x: number) => string, labels: (string | string[])[]): string {
        var quantityString: string = stringFromCoordinates(this.coords, coordToString, labels);
        if (this.uom) {
            var unitString = this.uom.toString().trim();
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

    /**
     * @method toExponential
     * @return {string}
     */
    toExponential(): string {
        var coordToString = function(coord: number): string { return coord.toExponential() };
        return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
    }

    /**
     * @method toFixed
     * @param [digits] {number}
     * @return {string}
     */
    toFixed(digits?: number): string {
        var coordToString = function(coord: number): string { return coord.toFixed(digits) };
        return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
    }

    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        let coordToString = function(coord: number): string { return coord.toString() };
        return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
    }

    /**
     * Provides access to the internals of Euclidean3 in order to use `product` functions.
     */
    private static mutator(M: Euclidean3): GeometricE3 {
        const that: GeometricE3 = {
            set α(α: number) {
                M._coords[COORD_SCALAR] = α
            },
            set alpha(alpha: number) {
                M._coords[COORD_SCALAR] = alpha
            },
            set x(x: number) {
                M._coords[COORD_X] = x
            },
            set y(y: number) {
                M._coords[COORD_Y] = y
            },
            set z(z: number) {
                M._coords[COORD_Z] = z
            },
            set yz(yz: number) {
                M._coords[COORD_YZ] = yz
            },
            set zx(zx: number) {
                M._coords[COORD_ZX] = zx
            },
            set xy(xy: number) {
                M._coords[COORD_XY] = xy
            },
            set β(β: number) {
                M._coords[COORD_PSEUDO] = β
            },
            set beta(beta: number) {
                M._coords[COORD_PSEUDO] = beta
            }
        }
        return that
    }

    /**
     * @method copy
     * @param m {GeometricE3}
     * @return {Euclidean3}
     * @static
     */
    static copy(m: GeometricE3): Euclidean3 {
        if (m instanceof Euclidean3) {
            return m
        }
        else {
            return new Euclidean3(m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β, void 0)
        }
    }

    /**
     * @method fromSpinorE3
     * @param spinor {SpinorE3}
     * @return {Euclidean3}
     * @static
     */
    static fromSpinorE3(spinor: SpinorE3): Euclidean3 {
        if (spinor) {
            return new Euclidean3(spinor.α, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0)
        }
        else {
            return void 0
        }
    }

    /**
     * @method fromVectorE3
     * @param vector {VectorE3}
     * @return {Euclidean3}
     * @static
     */
    static fromVectorE3(vector: VectorE3): Euclidean3 {
        if (vector) {
            return new Euclidean3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, void 0)
        }
        else {
            return void 0
        }
    }

    /**
     * @method vector
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param [uom] {Unit}
     * @return {Euclidean3}
     * @static
     */
    static vector(x: number, y: number, z: number, uom?: Unit): Euclidean3 {
        return new Euclidean3(0, x, y, z, 0, 0, 0, 0, uom)
    }
}
