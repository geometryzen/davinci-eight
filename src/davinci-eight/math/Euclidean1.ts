import Euclidean1Coords = require('../math/Euclidean1Coords')
import LinearElement = require('../math/LinearElement')
import Measure = require('../math/Measure')
import readOnly = require('../i18n/readOnly')
import Unit = require('../math/Unit')

function assertArgNumber(name: string, x: number): number {
    if (typeof x === 'number') {
        return x
    }
    else {
        throw new Error("Argument '" + name + "' must be a number")
    }
}

function assertArgEuclidean1(name: string, arg: Euclidean1): Euclidean1 {
    if (arg instanceof Euclidean1) {
        return arg
    }
    else {
        throw new Error("Argument '" + arg + "' must be a Euclidean1")
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
 * @class Euclidean1
 */
class Euclidean1 implements /*LinearElement<Euclidean1Coords, Euclidean1, Euclidean1Coords>,*/ Measure<Euclidean1> {
    // FIXME: rename w to alpha, and keep it private.
    private w: number;
    // FIXME: rename to beta, and make it private.
    public x: number;
    // Make it immutable
    public uom: Unit;
    /**
     * The Euclidean1 class represents a multivector for a 1-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean1
     * @constructor
     * @param {number} α The grade zero part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param uom The optional unit of measure.
     */
    constructor(α: number, x: number, uom?: Unit) {
        this.w = assertArgNumber('α', α)
        this.x = assertArgNumber('x', x)
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

    coordinates(): number[] {
        return [this.w, this.x]
    }

    copy(source: Euclidean1Coords): Euclidean1 {
        this.w = source.w
        this.x = source.x
        this.uom = source.uom;
        return this;
    }

    difference(a: Euclidean1Coords, b: Euclidean1Coords): Euclidean1 {
        this.w = a.w - b.w
        this.x = a.x - b.x
        this.uom = Unit.compatible(a.uom, b.uom)
        // FIXME this.uom.difference(a.uom, b.uom)
        return this;
    }

    add(rhs: Euclidean1): Euclidean1 {
        assertArgEuclidean1('rhs', rhs)
        return new Euclidean1(this.w + rhs.w, this.x + rhs.x, Unit.compatible(this.uom, rhs.uom))
    }

    sub(rhs: Euclidean1): Euclidean1 {
        assertArgEuclidean1('rhs', rhs)
        return new Euclidean1(this.w - rhs.w, this.x - rhs.x, Unit.compatible(this.uom, rhs.uom))
    }

    mul(rhs: Euclidean1): Euclidean1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('mul')
    }

    div(rhs: Euclidean1): Euclidean1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('div')
    }

    divByScalar(α: number) {
        return new Euclidean1(this.w / α, this.x / α, this.uom)
    }

    scp(rhs: Euclidean1): Euclidean1 {
        throw new Error('wedge')
    }

    ext(rhs: Euclidean1): Euclidean1 {
        throw new Error('wedge')
    }

    lerp(target: Euclidean1, α: number): Euclidean1 {
        // FIXME: TODO
        return this
    }

    lco(rhs: Euclidean1): Euclidean1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('lshift')
    }

    rco(rhs: Euclidean1): Euclidean1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('rshift')
    }

    pow(exponent: Euclidean1): Euclidean1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Error('pow')
    }

    cos(): Euclidean1 {
        throw new Error('cos')
    }

    cosh(): Euclidean1 {
        throw new Error('cosh')
    }

    exp(): Euclidean1 {
        throw new Error('exp')
    }

    norm(): Euclidean1 {
        return new Euclidean1(Math.sqrt(this.w * this.w + this.x * this.x), 0, this.uom)
    }

    quad(): Euclidean1 {
        return new Euclidean1(this.w * this.w + this.x * this.x, 0, Unit.mul(this.uom, this.uom))
    }

    scale(α: number) {
        return new Euclidean1(α * this.w, α * this.x, this.uom)
    }

    sin(): Euclidean1 {
        throw new Error('sin')
    }

    sinh(): Euclidean1 {
        throw new Error('sinh')
    }

    slerp(target: Euclidean1, α: number): Euclidean1 {
        // FIXME: TODO
        return this
    }
    unitary(): Euclidean1 {
        throw new Error('unitary')
    }

    toExponential(): string {
        return "Euclidean1"
    }

    toFixed(digits?: number): string {
        return "Euclidean1"
    }

    toString(): string {
        return "Euclidean1"
    }
}

export = Euclidean1
