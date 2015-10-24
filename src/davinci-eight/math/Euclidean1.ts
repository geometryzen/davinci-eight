import Euclidean1Coords = require('../math/Euclidean1Coords')
import Euclidean1Error = require('../math/Euclidean1Error')
import LinearElement = require('../math/LinearElement')
import Measure = require('../math/Measure')
import Unit = require('../math/Unit')

function assertArgNumber(name: string, x: number): number {
    if (typeof x === 'number') {
        return x
    }
    else {
        throw new Euclidean1Error("Argument '" + name + "' must be a number")
    }
}

function assertArgEuclidean1(name: string, arg: Euclidean1): Euclidean1 {
    if (arg instanceof Euclidean1) {
        return arg
    }
    else {
        throw new Euclidean1Error("Argument '" + arg + "' must be a Euclidean1")
    }
}

function assertArgUnitOrUndefined(name: string, uom: Unit): Unit {
    if (typeof uom === 'undefined' || uom instanceof Unit) {
        return uom
    }
    else {
        throw new Euclidean1Error("Argument '" + uom + "' must be a Unit or undefined")
    }
}

class Euclidean1 implements /*LinearElement<Euclidean1Coords, Euclidean1, Euclidean1Coords>,*/ Measure<Euclidean1> {
    public w: number;
    public x: number;
    public uom: Unit;
    /**
     * The Euclidean1 class represents a multivector for a 1-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean1
     * @constructor
     * @param {number} w The grade zero part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param uom The optional unit of measure.
     */
    constructor(w: number, x: number, uom?: Unit) {
        this.w = assertArgNumber('w', w)
        this.x = assertArgNumber('x', x)
        this.uom = assertArgUnitOrUndefined('uom', uom)
        if (this.uom && this.uom.scale !== 1) {
            var scale: number = this.uom.scale
            this.w *= scale
            this.x *= scale
            this.uom = new Unit(1, uom.dimensions, uom.labels)
        }
    }
    /**
     * @method clone
     * @return {Euclidean1}
     */
    clone(): Euclidean1 {
        return new Euclidean1(this.w, this.x, this.uom)
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
        throw new Euclidean1Error('mul')
    }

    div(rhs: Euclidean1): Euclidean1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Euclidean1Error('div')
    }

    align(rhs: Euclidean1): Euclidean1 {
        throw new Euclidean1Error('wedge')
    }

    wedge(rhs: Euclidean1): Euclidean1 {
        throw new Euclidean1Error('wedge')
    }

    lco(rhs: Euclidean1): Euclidean1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Euclidean1Error('lshift')
    }

    rco(rhs: Euclidean1): Euclidean1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Euclidean1Error('rshift')
    }

    pow(exponent: Euclidean1): Euclidean1 {
        // assertArgEuclidean1('rhs', rhs)
        throw new Euclidean1Error('pow')
    }

    cos(): Euclidean1 {
        throw new Euclidean1Error('cos')
    }

    cosh(): Euclidean1 {
        throw new Euclidean1Error('cosh')
    }

    exp(): Euclidean1 {
        throw new Euclidean1Error('exp')
    }

    norm(): Euclidean1 {
        return new Euclidean1(Math.sqrt(this.w * this.w + this.x * this.x), 0, this.uom)
    }

    quad(): Euclidean1 {
        return new Euclidean1(this.w * this.w + this.x * this.x, 0, Unit.mul(this.uom, this.uom))
    }

    sin(): Euclidean1 {
        throw new Euclidean1Error('sin')
    }

    sinh(): Euclidean1 {
        throw new Euclidean1Error('sinh')
    }

    unitary(): Euclidean1 {
        throw new Euclidean1Error('unitary')
    }

    gradeZero(): number {
        return this.w
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
