import QQ = require('../math/QQ');
declare class Dimensions {
    L: any;
    T: any;
    Q: any;
    temperature: any;
    amount: any;
    intensity: any;
    static MASS: Dimensions;
    static LENGTH: Dimensions;
    static TIME: Dimensions;
    private _mass;
    /**
     * The Dimensions class captures the physical dimensions associated with a unit of measure.
     *
     * @class Dimensions
     * @constructor
     * @param {QQ} mass The mass component of the dimensions object.
     * @param {QQ} length The length component of the dimensions object.
     * @param {QQ} time The time component of the dimensions object.
     * @param {QQ} charge The charge component of the dimensions object.
     * @param {QQ} temperature The temperature component of the dimensions object.
     * @param {QQ} amount The amount component of the dimensions object.
     * @param {QQ} intensity The intensity component of the dimensions object.
     */
    constructor(theMass: QQ, L: any, T: any, Q: any, temperature: any, amount: any, intensity: any);
    /**
    * The <em>mass</em> component of this dimensions instance.
    *
    * @property M
    * @type {QQ}
    */
    M: QQ;
    compatible(rhs: Dimensions): Dimensions;
    mul(rhs: Dimensions): Dimensions;
    div(rhs: Dimensions): Dimensions;
    pow(exponent: QQ): Dimensions;
    sqrt(): Dimensions;
    dimensionless(): boolean;
    /**
    * Determines whether all the components of the Dimensions instance are zero.
    *
    * @method isZero
    * @return {boolean} <code>true</code> if all the components are zero, otherwise <code>false</code>.
    */
    isZero(): boolean;
    negative(): Dimensions;
    toString(): string;
}
export = Dimensions;
