import Unit = require('davinci-blade/Unit');
import GeometricNumber = require('davinci-blade/GeometricNumber');
import GeometricQuantity = require('davinci-blade/GeometricQuantity');

function mul<T extends GeometricNumber>(lhs: Measure<T>, rhs: Measure<T>): Measure<T>
{
    return new Measure<T>(lhs.quantity.mul(rhs.quantity), lhs.uom.mul(rhs.uom));
}

function div<T extends GeometricNumber>(lhs: Measure<T>, rhs: Measure<T>): Measure<T>
{
    return new Measure<T>(lhs.quantity.div(rhs.quantity), lhs.uom.div(rhs.uom));
}

class Measure<T extends GeometricNumber> {

    private _quantity: T;
    private _uom: Unit;

    /**
     * A Measure is a composite consisting of a quantity and a unit of measure.
     *
     * @class Measure
     * @constructor
     * @param {QuantityOfMeasure<T>} quantity The <em>quantity</em> part of the measure.
     * @param {Unit} uom The unit-of-measure part of the measure.
     */
    constructor(quantity: T, uom: Unit)
    {
        if (uom.scale === 1)
        {
            this._quantity = quantity;
            this._uom = uom;
        }
        else
        {
            this._quantity = quantity.scalarMultiply(uom.scale);
            this._uom = new Unit(1, uom.dimensions, uom.labels);
        }
    }

    /**
    * The quantity part of the measure. 
    * 
    * @property quantity
    * @type {GeometricQuantity<T>}
    */
    get quantity(): T {
        return this._quantity;
    }

    /**
    * The unit part of the measure. 
    * 
    * @property uom
    * @type {Unit}
    */
    get uom(): Unit {
        return this._uom;
    }

    add(rhs: Measure<T>): Measure<T>
    {
        if (rhs instanceof Measure)
        {
            return new Measure<T>(this.quantity.add(rhs.quantity), this.uom.compatible(rhs.uom));
        }
        else
        {
            throw new Error("Measure.add(rhs): rhs must be a Measure.");
        }
    }

    sub(rhs: Measure<T>): Measure<T> {
        if (rhs instanceof Measure) {
            return new Measure<T>(this.quantity.sub(rhs.quantity), this.uom.compatible(rhs.uom));
        } else {
            throw new Error("Measure.sub(rhs): rhs must be a Measure.");
        }
    }

    mul(rhs: Measure<T>): Measure<T>
    {
        if (rhs instanceof Measure)
        {
            return new Measure<T>(this.quantity.mul(rhs.quantity), this.uom.mul(rhs.uom));
        }
        else if (rhs instanceof Unit)
        {
            return new Measure<T>(this.quantity, this.uom.mul(rhs));
        }
        else if (typeof rhs === 'number')
        {
            var other: any = rhs;
            return this.scalarMultiply(other);
        }
        else
        {
            throw new Error("Measure.mul(rhs): rhs must be a [Measure, Unit, number].");
        }
    }

    __mul__(other: any): any
    {
        if (other instanceof Measure)
        {
            return new Measure<T>(this.quantity.mul(other.quantity), this.uom.mul(other.uom));
        }
        else if (other instanceof Unit)
        {
            return new Measure<T>(this.quantity, this.uom.mul(other));
        }
        else if (typeof other === 'number')
        {
            return this.scalarMultiply(other);
        }
        else
        {
            return;
        }
    }

    __rmul__(other: any): any
    {
        if (other instanceof Measure)
        {
            return mul(other, this);
        }
        else if (other instanceof Unit)
        {
            return new Measure<T>(this.quantity, this.uom.mul(other));
        }
        else if (typeof other === 'number')
        {
            return this.scalarMultiply(other);
        }
        else
        {
            return;
        }
    }

    scalarMultiply(rhs: number): Measure<T>
    {
        return new Measure<T>(this.quantity.mul(rhs), this.uom);
    }

    div(rhs: Measure<T>): Measure<T>
    {
        if (rhs instanceof Measure)
        {
            return new Measure<T>(this.quantity.div(rhs.quantity), this.uom.div(rhs.uom));
        }
        else if (rhs instanceof Unit)
        {
            return new Measure<T>(this.quantity, this.uom.div(rhs));
        }
        else if (typeof rhs === 'number')
        {
            return new Measure<T>(this.quantity.div(rhs), this.uom);
        }
        else
        {
            throw new Error("Measure.div(rhs): rhs must be a [Measure, Unit, number].");
        }
    }

    __div__(other: any): any
    {
        if (other instanceof Measure)
        {
            return new Measure<T>(this.quantity.div(other.quantity), this.uom.div(other.uom));
        }
        else if (other instanceof Unit)
        {
            return new Measure<T>(this.quantity, this.uom.div(other));
        }
        else if (typeof other === 'number')
        {
            return new Measure<T>(this.quantity.div(other), this.uom);
        }
        else
        {
            return;
        }
    }

    __rdiv__(other: any): any
    {
        if (other instanceof Measure)
        {
            return div(other, this);
        }
        else
        {
            return;
        }
    }

    wedge(rhs: Measure<T>): Measure<T>
    {
        if (rhs instanceof Measure)
        {
            return new Measure<T>(this.quantity.wedge(rhs.quantity), this.uom.mul(rhs.uom));
        }
        else
        {
            throw new Error("Measure.wedge(rhs): rhs must be a Measure.");
        }
    }

    foo()
    {
        return;
    }

    lshift(rhs: Measure<T>): Measure<T> {
        if (rhs instanceof Measure) {
            return new Measure<T>(this.quantity.lshift(rhs.quantity), this.uom.mul(rhs.uom));
        } else {
            throw new Error("Measure.lshift(rhs): rhs must be a Measure.");
        }
    }

    rshift(rhs: Measure<T>): Measure<T> {
        if (rhs instanceof Measure) {
            return new Measure<T>(this.quantity.rshift(rhs.quantity), this.uom.mul(rhs.uom));
        } else {
            throw new Error("Measure.rshift(rhs): rhs must be a Measure.");
        }
    }

    norm(): Measure<T> {
      return new Measure<T>(<T>this.quantity.norm(), this.uom.norm());
    }

    quad(): Measure<T> {
      return new Measure<T>(<T>this.quantity.quad(), this.uom.quad());
    }

    toString(): string {
        return "" + this.quantity + " " + this.uom;
    }
}
export = Measure;