import GeometricE1 from './GeometricE1';
import GeometricNumber from './GeometricNumber';
import ImmutableMeasure from './ImmutableMeasure';
import mustBeInteger from '../checks/mustBeInteger';
import notImplemented from '../i18n/notImplemented';
import readOnly from '../i18n/readOnly';
import SpinorE1 from './SpinorE1';
import {Unit} from './Unit';
import VectorE1 from './VectorE1';

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

export default class G1 implements ImmutableMeasure<G1>, GeometricE1, GeometricNumber<G1, G1, SpinorE1, VectorE1, G1, number, Unit> {
    private w: number;
    private _x: number;
    public uom: Unit;

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

    get a(): number {
        return this.w;
    }
    set a(alpha: number) {
        throw new Error(readOnly('a').message)
    }

    get x(): number {
        return this._x;
    }
    set x(unused) {
        throw new Error(readOnly('x').message)
    }

    get coords(): number[] {
        return [this.w, this.x]
    }

    copy(source: GeometricE1): G1 {
        this.w = source.a;
        this.x = source.x;
        return this;
    }

    difference(a: GeometricE1, b: GeometricE1): G1 {
        this.w = a.a - b.a;
        this.x = a.x - b.x;
        // FIXME this.uom.difference(a.uom, b.uom)
        return this;
    }

    add(rhs: G1): G1 {
        assertArgEuclidean1('rhs', rhs)
        return new G1(this.w + rhs.w, this.x + rhs.x, Unit.compatible(this.uom, rhs.uom))
    }

    addScalar(α: Unit): G1 {
        throw new Error('addScalar')
    }

    adj(): G1 {
        throw new Error('adj')
    }

    angle(): G1 {
        return this.log().grade(2);
    }

    conj(): G1 {
        throw new Error('conj')
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

    inv(): G1 {
        throw new Error('inv')
    }

    isOne(): boolean {
        return this.a === 1 && this.x === 0
    }

    isZero(): boolean {
        return this.a === 0 && this.x === 0
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

    magnitude(): G1 {
        throw new Error('magnitude')
    }

    rev(): G1 {
        throw new Error(notImplemented('rev').message)
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

    neg(): G1 {
        throw new Error('neg')
    }

    norm(): G1 {
        return new G1(Math.sqrt(this.w * this.w + this.x * this.x), 0, this.uom)
    }

    quad(): G1 {
        return new G1(this.w * this.w + this.x * this.x, 0, Unit.mul(this.uom, this.uom))
    }

    reflect(n: VectorE1): G1 {
        throw new Error('reflect')
    }

    rotate(s: SpinorE1): G1 {
        throw new Error('rotate')
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

    squaredNorm(): G1 {
        throw new Error(notImplemented('squaredNorm').message)
    }

    stress(σ: VectorE1): G1 {
        throw new Error(notImplemented('stress').message)
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

    toExponential(fractionDigits?: number): string {
        return "G1"
    }

    toFixed(fractionDigits?: number): string {
        return "G1"
    }

    toPrecision(precision?: number): string {
        return "G1"
    }

    toString(radix?: number): string {
        return "G1"
    }
}
