import {Dimensions} from './Dimensions'
import {QQ} from './QQ'
import {Unit} from './Unit'

const Rat0 = QQ.valueOf(0, 1)
const Rat1 = QQ.valueOf(1, 1)
const Rat2 = QQ.valueOf(2, 1)

const ONE = Unit.ONE
const KILOGRAM = Unit.KILOGRAM
const METER = Unit.METER
const SECOND = Unit.SECOND
const AMPERE = Unit.AMPERE
const COULOMB = Unit.COULOMB
const KELVIN = Unit.KELVIN
const MOLE = Unit.MOLE
const CANDELA = Unit.CANDELA

const NEWTON = KILOGRAM.mul(METER).div(SECOND).div(SECOND)
const JOULE = NEWTON.mul(METER)
const HERTZ = ONE.div(SECOND)
const WATT = JOULE.div(SECOND)
const VOLT = JOULE.div(COULOMB)
const WEBER = VOLT.mul(SECOND)
const TESLA = WEBER.div(METER).div(METER)
const OHM = VOLT.div(AMPERE)
const SIEMEN = AMPERE.div(VOLT)
const FARAD = COULOMB.div(VOLT)
const HENRY = KILOGRAM.mul(METER).mul(METER).div(COULOMB).div(COULOMB)
const PASCAL = NEWTON.div(METER).div(METER)

describe("Unit", function() {
    const symbols = ["kg", "m", "s", "C", "K", "mol", "cd"];

    it("Construction", function() {
        const meter = new Unit(1, new Dimensions(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        expect(meter.multiplier).toBe(1);
    });

    it("toString", function() {
        const dimensionless = new Unit(1234, new Dimensions(Rat0, Rat0, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        expect(ONE.toString()).toBe("");
        expect(METER.toString()).toBe("m");
        expect(KILOGRAM.toString()).toBe("kg");
        expect(SECOND.toString()).toBe("s");
        expect(AMPERE.toString()).toBe("A");
        expect(COULOMB.toString()).toBe("C");
        expect(KELVIN.toString()).toBe("K");
        expect(MOLE.toString()).toBe("mol");
        expect(CANDELA.toString()).toBe("cd");
        expect(dimensionless.toString()).toBe("1234");
    });
    it("mul", function() {
        const meter = new Unit(1, new Dimensions(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const centimeter = meter.__mul__(0.01);
        const inch = centimeter.__mul__(2.54);
        const foot = inch.__mul__(12);
        const yard = foot.__mul__(3);
        const mile = yard.__mul__(1760);
        const micron = meter.__mul__(1e-6);
        const nanometer = meter.__mul__(1e-9);

        expect(meter.toFixed(4)).toBe("m");
        expect(centimeter.toString()).toBe("0.01 m");
        expect(inch.toFixed(4).toString()).toBe("0.0254 m");
        expect(foot.toFixed(4).toString()).toBe("0.3048 m");
        expect(yard.toFixed(4).toString()).toBe("0.9144 m");
        expect(mile.toFixed(3).toString()).toBe("1609.344 m");
        expect(micron.toString()).toBe("0.000001 m");
        expect(nanometer.toString()).toBe("1e-9 m");

        expect(inch.multiplier).toBeCloseTo(0.0254, 4);
        expect(foot.multiplier).toBeCloseTo(0.3048, 4);
        expect(yard.multiplier).toBeCloseTo(0.9144, 4);
        expect(mile.multiplier).toBeCloseTo(1609.344, 4);
        expect(micron.multiplier * 1e6).toBe(1);
        expect(nanometer.multiplier * 1e9).toBe(1);
    });
    it("mul by number", function() {
        const meter = new Unit(1, new Dimensions(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const yard = meter.__mul__(2.54 * 36 / 100);
        expect(yard.toString()).toBe("0.9144 m");
    });
    it("mul by Unit", function() {
        const meter = new Unit(1, new Dimensions(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const second = new Unit(1, new Dimensions(Rat0, Rat0, Rat1, Rat0, Rat0, Rat0, Rat0), symbols);
        const areaUnit = meter.mul(second);
        expect(meter.toString()).toBe("m");
        expect(second.toString()).toBe("s");
        expect(areaUnit.toString()).toBe("m s");
    });
    it("div by Unit", function() {
        const meter = new Unit(1, new Dimensions(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const second = new Unit(1, new Dimensions(Rat0, Rat0, Rat1, Rat0, Rat0, Rat0, Rat0), symbols);
        const speedUnit = meter.div(second);
        expect(meter.toString()).toBe("m");
        expect(second.toString()).toBe("s");
        expect(speedUnit.toString()).toBe("m/s");
    });
    it("pow by number", function() {
        const meter = new Unit(1, new Dimensions(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const square = meter.pow(Rat2);
        // const radian = new Unit(1, new Dimensions(Rat0, Rat0, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        expect(meter.toString()).toBe("m");
        expect(square.toString()).toBe("m ** 2");
    });
    it("inverse", function() {
        // const dimensionless = new Unit(1234, new Dimensions(Rat0, Rat0, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        expect(ONE.inv().toString()).toBe("");
        expect(METER.inv().toString()).toBe("m ** -1");
        expect(KILOGRAM.inv().toString()).toBe("kg ** -1");
        expect(SECOND.inv().toString()).toBe("Hz");
        expect(AMPERE.inv().toString()).toBe("s C ** -1");
        expect(KELVIN.inv().toString()).toBe("K ** -1");
        expect(MOLE.inv().toString()).toBe("mol ** -1");
        expect(CANDELA.inv().toString()).toBe("cd ** -1");
    });
    it("electric current", function() {
        expect(AMPERE.toString()).toBe("A");
    });
    it("electric charge", function() {
        expect(COULOMB.toString()).toBe("C");
    });
    it("force", function() {
        expect(NEWTON.toString()).toBe("N");
    });
    it("energy", function() {
        expect(JOULE.toString()).toBe("J");
    });
    it("frequency", function() {
        expect(HERTZ.toString()).toBe("Hz");
    });
    it("power", function() {
        expect(WATT.toString()).toBe("W");
    });
    it("electric potential", function() {
        expect(VOLT.toString()).toBe("V");
    });
    it("electric field strength", function() {
        expect(VOLT.div(METER).toString()).toBe("V/m");
    });
    it("magnetic flux", function() {
        expect(WEBER.toString()).toBe("Wb");
    });
    it("magnetic flux density", function() {
        expect(TESLA.toString()).toBe("T");
    });
    it("electrical resistance", function() {
        expect(OHM.toString()).toBe("Ω");
    });
    it("electrical conductance", function() {
        expect(SIEMEN.toString()).toBe("S");
    });
    it("electrical capacitance", function() {
        expect(FARAD.toString()).toBe("F");
    });
    it("electrical inductance", function() {
        expect(WEBER.div(AMPERE).toString()).toBe("H");
        expect(HENRY.toString()).toBe("H");
    });
    it("electric permittivity", function() {
        expect(FARAD.div(METER).toString()).toBe("F/m");
    });
    it("electric permeability", function() {
        expect(HENRY.div(METER).toString()).toBe("H/m");
    });
    it("pressure, stress", function() {
        expect(PASCAL.toString()).toBe("Pa");
    });
    it("angular momentum", function() {
        expect(JOULE.mul(SECOND).toString()).toBe("J·s");
    });
    it("dynamic viscosity", function() {
        expect(PASCAL.mul(SECOND).toString()).toBe("Pa·s");
    });
    it("moment of force", function() {
        //    expect(NEWTON.mul(METER).toString()).toBe("N·m");
        expect(NEWTON.mul(METER).toString()).toBe("J");
    });
    it("surface tension", function() {
        expect(NEWTON.div(METER).toString()).toBe("N/m");
    });
    it("heat flux density", function() {
        expect(WATT.div(METER).div(METER).toString()).toBe("W/m ** 2");
    });
    it("heat capacity, entropy", function() {
        expect(JOULE.div(KELVIN).toString()).toBe("J/K");
    });
    it("energy density", function() {
        // This could be a J/m ** 3 but that's a pressure too.
        expect(JOULE.div(METER).div(METER).div(METER).toString()).toBe("Pa");
    });
    it("specific energy", function() {
        expect(JOULE.div(KILOGRAM).toString()).toBe("J/kg");
    });
    it("molar energy", function() {
        expect(JOULE.div(MOLE).toString()).toBe("J/mol");
    });
    it("electric charge density", function() {
        expect(COULOMB.div(METER).div(METER).div(METER).toString()).toBe("C/m ** 3");
    });
    it("exposure (x-rays and γ-rays)", function() {
        expect(COULOMB.div(KILOGRAM).toString()).toBe("C/kg");
    });

    describe("Operator Overloading", function() {

        var m = METER;

        describe("Binary +", function() {

            it("m.__add__(m)", function() {
                var actual = m.__add__(m);
                expect(actual.multiplier).toBe(2);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });
            it("m.__radd__(m)", function() {
                var actual = m.__radd__(m);
                expect(actual.multiplier).toBe(2);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

        });

        describe("Binary -", function() {

            it("m.__sub__(m)", function() {
                var actual = m.__sub__(m);
                expect(actual.multiplier).toBe(0);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("m.__rsub__(m)", function() {
                var actual = m.__rsub__(m);
                expect(actual.multiplier).toBe(0);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

        });

        describe("Binary *", function() {

            it("m.__mul__(m)", function() {
                var actual = m.__mul__(m);
                expect(actual.toString()).toBe("m ** 2");
                expect(actual.multiplier).toBe(1);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(2);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("m * 5", function() {
                var actual = m.__mul__(5);
                expect(actual.toString()).toBe("5 m");
                expect(actual.multiplier).toBe(5);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("m.__rmul__(m)", function() {
                var actual = m.__rmul__(m);
                expect(actual.multiplier).toBe(1);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(2);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("5 * m", function() {
                var actual = m.__rmul__(5);
                expect(actual.multiplier).toBe(5);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

        });

        describe("Binary /", function() {

            it("m.__div__(m)", function() {
                var actual = m.__div__(m);
                expect(actual.toString()).toBe("");
                expect(actual.multiplier).toBe(1);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(0);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("m / 5", function() {
                var actual = m.__div__(5);
                expect(actual.toString()).toBe("0.2 m");
                expect(actual.multiplier).toBe(1 / 5);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("m.__rdiv__(m)", function() {
                var actual = m.__rdiv__(m);
                expect(actual.multiplier).toBe(1);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(0);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

            it("5 / m", function() {
                var actual = m.__rdiv__(5);
                expect(actual instanceof Unit).toBe(true);
                expect(actual.multiplier).toBe(5);
                expect(actual.dimensions.M.numer).toBe(0);
                expect(actual.dimensions.M.denom).toBe(1);
                expect(actual.dimensions.L.numer).toBe(-1);
                expect(actual.dimensions.L.denom).toBe(1);
                expect(actual.dimensions.T.numer).toBe(0);
                expect(actual.dimensions.T.denom).toBe(1);
            });

        });

    });

});
