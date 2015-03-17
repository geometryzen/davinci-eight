import core = require('davinci-blade/core');
import Euclidean2 = require('davinci-blade/Euclidean2');
import Euclidean3 = require('davinci-blade/Euclidean3');
import Rational = require('davinci-blade/Rational');
import Dimensions = require('davinci-blade/Dimensions');
import Unit = require('davinci-blade/Unit');
import Measure = require('davinci-blade/Measure');

var UNIT_SYMBOLS: string[] = ["kg", "m", "s", "C", "K", "mol", "cd"];

var R0 = Rational.ZERO;
var R1 = Rational.ONE;
var N1 = Rational.MINUS_ONE;

var UNIT_DIMLESS = new Unit(1, new Dimensions(R0, R0, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

var UNIT_KILOGRAM = new Unit(1, new Dimensions(R1, R0, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

var UNIT_METER = new Unit(1, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

var UNIT_SECOND = new Unit(1, new Dimensions(R0, R0, R1, R0, R0, R0, R0), UNIT_SYMBOLS);

var UNIT_AMPERE = new Unit(1, new Dimensions(R0, R0, N1, R1, R0, R0, R0), UNIT_SYMBOLS);

var UNIT_KELVIN = new Unit(1, new Dimensions(R0, R0, R0, R0, R1, R0, R0), UNIT_SYMBOLS);

var UNIT_MOLE = new Unit(1, new Dimensions(R0, R0, R0, R0, R0, R1, R0), UNIT_SYMBOLS);

var UNIT_CANDELA = new Unit(1, new Dimensions(R0, R0, R0, R0, R0, R0, R1), UNIT_SYMBOLS);

var UNIT_COULOMB = new Unit(1, new Dimensions(R0, R0, R0, R1, R0, R0, R0), UNIT_SYMBOLS);

var UNIT_INCH = new Unit(0.0254, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

var UNIT_FOOT = new Unit(0.3048, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

var UNIT_YARD = new Unit(0.9144, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

var UNIT_MILE = new Unit(1609.344, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

var UNIT_POUND = new Unit(0.45359237, new Dimensions(R1, R0, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

/**
 * Provides the blade module
 *
 * @module blade
 */
var blade = {
    'VERSION': core.VERSION,
    Euclidean2: Euclidean2,
    Euclidean3: Euclidean3,
    Rational: Rational,
    Dimensions: Dimensions,
    Unit: Unit,
    Measure: Measure,
    /**
     * A dimensionless unit.
     *
     * @property UNIT_DIMLESS
     * @type Unit
     * @static
     * @final
     */
    UNIT_DIMLESS: UNIT_DIMLESS,
    UNIT_KILOGRAM: UNIT_KILOGRAM,
    UNIT_METER: UNIT_METER,
    UNIT_SECOND: UNIT_SECOND,
    UNIT_AMPERE: UNIT_AMPERE,
    UNIT_KELVIN: UNIT_KELVIN,
    UNIT_MOLE: UNIT_MOLE,
    UNIT_CANDELA: UNIT_CANDELA,
    UNIT_COULOMB: UNIT_COULOMB,
    UNIT_INCH: UNIT_INCH,
    UNIT_FOOT: UNIT_FOOT,
    UNIT_YARD: UNIT_YARD,
    UNIT_MILE: UNIT_MILE,
    UNIT_POUND: UNIT_POUND
};
export = blade;