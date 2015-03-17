import Field = require('davinci-blade/Field');
import Dimensions = require('davinci-blade/Dimensions');
import Rational = require('davinci-blade/Rational');

class Unit implements Field<Unit> {
    /**
     * The Unit class represents the units for a measure.
     *
     * @class Unit
     * @constructor
     * @param {number} scale
     * @param {Dimensions} dimensions
     * @param {string[]} labels The label strings to use for each dimension.
     */
    constructor(public scale: number, public dimensions: Dimensions, public labels: string[]) {
        if (labels.length !== 7) {
            throw new Error("Expecting 7 elements in the labels array.");
        }
        this.scale = scale;
        this.dimensions = dimensions;
        this.labels = labels;
    }

    compatible(rhs: Unit) {
        var dimensions;

        if (rhs instanceof Unit) {
            dimensions = this.dimensions.compatible(rhs.dimensions);
            return this;
        } else {
            throw new Error("Illegal Argument for Unit.compatible: " + rhs);
        }
    }

    add(rhs: Unit): Unit {
        if (rhs instanceof Unit) {
            return new Unit(this.scale + rhs.scale, this.dimensions.compatible(rhs.dimensions), this.labels);
        } else {
            throw new Error("Illegal Argument for Unit.add: " + rhs);
        }
    }

    sub(rhs: Unit): Unit {
        if (rhs instanceof Unit) {
            return new Unit(this.scale - rhs.scale, this.dimensions.compatible(rhs.dimensions), this.labels);
        } else {
            throw new Error("Illegal Argument for Unit.sub: " + rhs);
        }
    }

    mul(rhs: any): Unit {
        if (typeof rhs === 'number') {
            return new Unit(this.scale * rhs, this.dimensions, this.labels);
        } else if (rhs instanceof Unit) {
            return new Unit(this.scale * rhs.scale, this.dimensions.mul(rhs.dimensions), this.labels);
        } else {
            throw new Error("Illegal Argument for mul: " + rhs);
        }
    }

    div(rhs: any): Unit {
        if (typeof rhs === 'number') {
            return new Unit(this.scale / rhs, this.dimensions, this.labels);
        } else if (rhs instanceof Unit) {
            return new Unit(this.scale / rhs.scale, this.dimensions.div(rhs.dimensions), this.labels);
        } else {
            throw new Error("Illegal Argument for div: " + rhs);
        }
    }

    pow(rhs: number): Unit {
        if (typeof rhs === 'number') {
            return new Unit(Math.pow(this.scale, rhs), this.dimensions.pow(rhs), this.labels);
        } else {
            throw new Error("Illegal Argument for div: " + rhs);
        }
    }

    inverse(): Unit {
        return new Unit(1 / this.scale, this.dimensions.negative(), this.labels);
    }

    toString(): string {
        var operatorStr: string;
        var scaleString: string;
        var unitsString: string;
        var stringify = function(rational: Rational, label: string): string {
            if (rational.numer === 0) {
                return null;
            } else if (rational.denom === 1) {
                if (rational.numer === 1) {
                    return "" + label;
                } else {
                    return "" + label + " ** " + rational.numer;
                }
            }
            return "" + label + " ** " + rational;
        };

        operatorStr = this.scale === 1 || this.dimensions.isZero() ? "" : " ";
        scaleString = this.scale === 1 ? "" : "" + this.scale;
        unitsString = [stringify(this.dimensions.M, this.labels[0]), stringify(this.dimensions.L, this.labels[1]), stringify(this.dimensions.T, this.labels[2]), stringify(this.dimensions.Q, this.labels[3]), stringify(this.dimensions.temperature, this.labels[4]), stringify(this.dimensions.amount, this.labels[5]), stringify(this.dimensions.intensity, this.labels[6])].filter(function(x) {
            return typeof x === 'string';
        }).join(" ");
        return "" + scaleString + operatorStr + unitsString;
    }
}
export = Unit;