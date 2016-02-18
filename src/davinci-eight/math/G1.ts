import GeometricE1 from '../math/GeometricE1';
import ImmutableMeasure from '../math/ImmutableMeasure';
import mustBeInteger from '../checks/mustBeInteger';
import readOnly from '../i18n/readOnly';
import Unit from '../math/Unit';

function assertArgNumber(name: string, x: number): number {
    if (typeof x === 'number') {
        return x
    }
    else {
        throw new Error("Argument '" + name + "' must be a number")
    }
}

function assertArgEuclidean1(name: string, arg: G1): G1 {
    if (arg instanceof G1) {
        return arg
    }
    else {
        throw new Error("Argument '" + arg + "' must be a G1")
    }
}

function assertArgUnitOrUndefined(name: string, uom: Unit): Unit {
    if (typeof uom === 'undefined' || uom instanceof Unit) {
        return uom
    }
    else {
        throw new Error("Argument '" + uom + "' must be a Unit or undefined")
    }
}

/**
 * @class G1
 */
export default class G1 implements /*LinearElement<GeometricE1, G1, GeometricE1>,*/ ImmutableMeasure<G1> {
    private w: number;
    private x: number;
    public uom: Unit;
    /**
     * The G1 class represents a multivector for a 1-dimensional linear space with a Euclidean metric.
     *
     * @class G1
     * @constructor
     * @param {number} α The grade zero part of the multivector.
     * @param {number} β The vector component of the multivector.
     * @param uom The optional unit of measure.
     */
    constructor(α: number, β: number, uom?: Unit) {
        this.w = assertArgNumber('α', α)
        this.x = assertArgNumber('β', β)
        this.uom = assertArgUnitOrUndefined('uom', uom)
        if (this.uom && this.uom.multiplier !== 1) {
            var multiplier: number = this.uom.multiplier
            this.w *= multiplier
            this.x *= multiplier
            this.uom = new Unit(1, uom.dimensions, uom.labels)
        }
    }

    /**
     * The scalar part of this multivector.
     * @property α
     * @return {number}
     */
    get α(): number {
        return this.w;
    }
    set α(unused) {
        throw new Error(readOnly('α').message)
    }

    /**
     * The pseudoscalar part of this multivector.
     * @property β
     * @return {number}
     */
    get β(): number {
        return this.x;
    }
    set β(unused) {
        throw new Error(readOnly('β').message)
    }

    /**
     * The pseudoscalar part of this multivector.
     * @property beta
     * @return {number}
     */
    get beta(): number {
        return this.x;
    }
    set beta(unused) {
        throw new Error(readOnly('beta').message)
    }

    get coords(): number[] {
        return [this.w, this.x]
    }

    copy(source: GeometricE1): G1 {
        this.w = source.w;
        this.x = source.x;
        this.uom = source.uom;
        return this;
    }

    difference(a: GeometricE1, b: GeometricE1): G1 {
        this.w = a.w - b.w;
        this.x = a.x - b.x;
        this.uom = Unit.compatible(a.uom, b.uom);
        // FIXME this.uom.difference(a.uom, b.uom)
        return this;
    }

    add(rhs: G1): G1 {
        assertArgEuclidean1('rhs', rhs)
        return new G1(this.w + rhs.w, this.x + rhs.x, Unit.compatible(this.uom, rhs.uom))
    }

    /**
     * @method angle
     * @return {G1}
     */
    angle(): G1 {
        return this.log().grade(2);
    }

    sub(rhs: G1): G1 {
        assertArgEuclidean1('rhs', rhs)
        return new G1(this.w - rhs.w, this.x - rhs.x, Unit.compatible(this.uom, rhs.uom))
    }

    mul(rhs: G1): G1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('mul')
    }

    div(rhs: G1): G1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('div')
    }

    divByScalar(α: number) {
        return new G1(this.w / α, this.x / α, this.uom)
    }

    scp(rhs: G1): G1 {
        throw new Error('wedge')
    }

    ext(rhs: G1): G1 {
        throw new Error('wedge')
    }

    lco(rhs: G1): G1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('lshift')
    }

    lerp(target: G1, α: number): G1 {
        // FIXME: TODO
        return this
    }

    log(): G1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('log')
    }

    rco(rhs: G1): G1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('rshift')
    }

    pow(exponent: G1): G1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('pow')
    }

    cos(): G1 {
        throw new Error('cos')
    }

    cosh(): G1 {
        throw new Error('cosh')
    }

    exp(): G1 {
        throw new Error('exp')
    }

    norm(): G1 {
        return new G1(Math.sqrt(this.w * this.w + this.x * this.x), 0, this.uom)
    }

    quad(): G1 {
        return new G1(this.w * this.w + this.x * this.x, 0, Unit.mul(this.uom, this.uom))
    }

    scale(α: number) {
        return new G1(α * this.w, α * this.x, this.uom)
    }

    sin(): G1 {
        throw new Error('sin')
    }

    sinh(): G1 {
        throw new Error('sinh')
    }

    slerp(target: G1, α: number): G1 {
        // FIXME: TODO
        return this
    }
    direction(): G1 {
        throw new Error('direction')
    }

    grade(grade: number): G1 {
        mustBeInteger('grade', grade)
        switch (grade) {
            case 0: return new G1(this.w, 0, this.uom)
            case 1: return new G1(0, this.x, this.uom)
            default: return new G1(0, 0, this.uom)
        }
    }

    toExponential(): string {
        return "G1"
    }

    toFixed(digits?: number): string {
        return "G1"
    }

    toString(): string {
        return "G1"
    }
}
