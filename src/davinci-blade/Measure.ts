import Geometric = require('davinci-blade/Geometric');
import GeometricQuantity = require('davinci-blade/GeometricQuantity');
import Unit = require('davinci-blade/Unit');

class Measure<T> implements Geometric<Measure<T>> {

    private _quantity: any;
    private _uom: Unit;

    /**
     * A Measure is a composite consisting of a quantity and a unit of measure.
     *
     * @class Measure
     * @constructor
     * @param {QuantityOfMeasure<T>} quantity The <em>quantity</em> part of the measure.
     * @param {Unit} uom The unit-of-measure part of the measure.
     */
    constructor(quantity: any, uom: Unit) {

        if (uom.scale === 1) {
            this._quantity = quantity;
            this._uom = uom;
        } else {
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
    get quantity(): any {
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

    add(rhs: Measure<T>): Measure<T> {
        if (rhs instanceof Measure) {
            var that: Measure<T> = rhs;
            var qthis: any = this.quantity;
            var qthat: any = that.quantity;
            var qmade: any = qthis.add(qthat);
            return new Measure<T>(qmade, this.uom.compatible(that.uom));
        } else {
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

    mul(rhs: Measure<T>): Measure<T> {
        if (rhs instanceof Measure) {
            return new Measure<T>(this.quantity.mul(rhs.quantity), this.uom.mul(rhs.uom));
        } else if (rhs instanceof Unit) {
            return new Measure<T>(this.quantity, this.uom.mul(rhs));
        } else if (typeof rhs === 'number') {
            var other: any = rhs;
            return this.scalarMultiply(other);
        } else {
            throw new Error("Measure.mul(rhs): rhs must be a [Measure, Unit, number]");
        }
    }

    scalarMultiply(rhs: number): Measure<T> {
        return new Measure<T>(this.quantity.mul(rhs), this.uom);
    }

    div(rhs: Measure<T>): Measure<T> {
        if (rhs instanceof Measure) {
            return new Measure<T>(this.quantity.div(rhs.quantity), this.uom.div(rhs.uom));
        } else if (rhs instanceof Unit) {
            return new Measure<T>(this.quantity, this.uom.div(rhs));
        } else if (typeof rhs === 'number') {
            return new Measure<T>(this.quantity.div(rhs), this.uom);
        } else {
            throw new Error("Measure.div(rhs): rhs must be a [Measure, Unit, number]");
        }
    }

    wedge(rhs: Measure<T>): Measure<T> {
        if (rhs instanceof Measure) {
            return new Measure<T>(this.quantity.wedge(rhs.quantity), this.uom.mul(rhs.uom));
        } else {
            throw new Error("Measure.wedge(rhs): rhs must be a Measure");
        }
    }

    lshift(rhs: Measure<T>): Measure<T> {
        if (rhs instanceof Measure) {
            return new Measure<T>(this.quantity.lshift(rhs.quantity), this.uom.mul(rhs.uom));
        } else {
            throw new Error("Measure.lshift(rhs): rhs must be a Measure");
        }
    }

    rshift(rhs: Measure<T>): Measure<T> {
        if (rhs instanceof Measure) {
            return new Measure<T>(this.quantity.rshift(rhs.quantity), this.uom.mul(rhs.uom));
        } else {
            throw new Error("Measure.rshift(rhs): rhs must be a Measure");
        }
    }

    norm(): Measure<T> {
        return null;
    }

    quad(): Measure<T> {
        return null;
    }

    toString(): string {
        return "" + this.quantity + " " + this.uom;
    }
}
export = Measure;