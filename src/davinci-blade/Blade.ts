/// <reference path="Rational.ts"/>
/// <reference path="Dimensions.ts"/>
/// <reference path="Unit.ts"/>
/// <reference path="Measure.ts"/>
/// <reference path="Euclidean2.ts"/>
/// <reference path="Euclidean3.ts"/>
/// <reference path="Field.ts"/>
/// <reference path="GeometricQuantity.ts"/>
module Blade {

    var UNIT_SYMBOLS: string[] = ["kg", "m", "s", "C", "K", "mol", "cd"];

    var R0 = Rational.ZERO;
    var R1 = Rational.ONE;
    var MINUS_ONE = Rational.MINUS_ONE;

    export var UNIT_DIMLESS = new Unit(1, new Dimensions(R0, R0, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

    export var UNIT_KILOGRAM = new Unit(1, new Dimensions(R1, R0, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

    export var UNIT_METER = new Unit(1, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);

    export var UNIT_SECOND = new Unit(1, new Dimensions(R0, R0, R1, R0, R0, R0, R0), UNIT_SYMBOLS);

    export var UNIT_AMPERE = new Unit(1, new Dimensions(R0, R0, MINUS_ONE, R1, R0, R0, R0), UNIT_SYMBOLS);

    export var UNIT_KELVIN = new Unit(1, new Dimensions(R0, R0, R0, R0, R1, R0, R0), UNIT_SYMBOLS);

    export var UNIT_MOLE = new Unit(1, new Dimensions(R0, R0, R0, R0, R0, R1, R0), UNIT_SYMBOLS);

    export var UNIT_CANDELA = new Unit(1, new Dimensions(0, 0, 0, 0, 0, 0, R1), UNIT_SYMBOLS);

    export var UNIT_COULOMB = new Unit(1, new Dimensions(0, 0, 0, R1, 0, 0, 0), UNIT_SYMBOLS);

    export var UNIT_INCH = new Unit(0.0254, new Dimensions(0, R1, 0, 0, 0, 0, 0), UNIT_SYMBOLS);

    export var UNIT_FOOT = new Unit(0.3048, new Dimensions(0, R1, 0, 0, 0, 0, 0), UNIT_SYMBOLS);

    export var UNIT_YARD = new Unit(0.9144, new Dimensions(0, R1, 0, 0, 0, 0, 0), UNIT_SYMBOLS);

    export var UNIT_MILE = new Unit(1609.344, new Dimensions(0, R1, 0, 0, 0, 0, 0), UNIT_SYMBOLS);

    export var UNIT_POUND = new Unit(0.45359237, new Dimensions(R1, 0, 0, 0, 0, 0, 0), UNIT_SYMBOLS);
}