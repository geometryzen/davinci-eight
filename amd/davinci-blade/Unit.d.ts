import Dimensions = require('davinci-blade/Dimensions');
declare class Unit {
    scale: number;
    dimensions: Dimensions;
    labels: string[];
    /**
     * The Unit class represents the units for a measure.
     *
     * @class Unit
     * @constructor
     * @param {number} scale
     * @param {Dimensions} dimensions
     * @param {string[]} labels The label strings to use for each dimension.
     */
    constructor(scale: number, dimensions: Dimensions, labels: string[]);
    compatible(rhs: Unit): Unit;
    add(rhs: Unit): Unit;
    __add__(other: any): Unit;
    __radd__(other: any): Unit;
    sub(rhs: Unit): Unit;
    __sub__(other: any): Unit;
    __rsub__(other: any): Unit;
    mul(rhs: any): Unit;
    __mul__(other: any): Unit;
    __rmul__(other: any): Unit;
    div(rhs: any): Unit;
    __div__(other: any): Unit;
    __rdiv__(other: any): Unit;
    pow(rhs: number): Unit;
    inverse(): Unit;
    norm(): Unit;
    quad(): Unit;
    toString(): string;
}
export = Unit;
