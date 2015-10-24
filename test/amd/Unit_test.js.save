define([
    'davinci-blade/Rational',
    'davinci-blade/Dimensions',
    'davinci-blade/Unit',
    'davinci-blade/Complex',
    'davinci-blade'
], function(
    Rational,
    Dimensions,
    Unit,
    Complex,
    blade
) {
describe("Unit", function() {
    var labels;
    labels = ["kg", "m", "s", "C", "K", "mol", "cd"];
    it("Construction", function() {
      var meter;
      meter = new Unit(1, new Dimensions(0, 1, 0, 0, 0, 0, 0), labels);
      expect(meter.scale).toBe(1);
    });
    it("toString", function() {
      var dimensionless;
      dimensionless = new Unit(1234, new Dimensions(0, 0, 0, 0, 0, 0, 0), labels);
      expect(blade.units.unity.toString()).toBe("");
      expect(blade.units.meter.toString()).toBe("m");
      expect(blade.units.kilogram.toString()).toBe("kg");
      expect(blade.units.second.toString()).toBe("s");
      expect(blade.units.ampere.toString()).toBe("A");
      expect(blade.units.kelvin.toString()).toBe("K");
      expect(blade.units.mole.toString()).toBe("mol");
      expect(blade.units.candela.toString()).toBe("cd");
      expect(dimensionless.toString()).toBe("1234");
    });
    it("mul", function() {
      var angstrom, centimeter, foot, inch, meter, micron, mile, nanometer, yard;
      meter = new Unit(1, new Dimensions(0, 1, 0, 0, 0, 0, 0), labels);
      centimeter = meter.__mul__(0.01);
      inch = centimeter.__mul__(2.54);
      foot = inch.__mul__(12);
      yard = foot.__mul__(3);
      mile = yard.__mul__(1760);
      micron = meter.__mul__(1e-6);
      nanometer = meter.__mul__(1e-9);
      angstrom = nanometer.__mul__(1e-1);
      expect(meter.toString()).toBe("m");
      expect(centimeter.toString()).toBe("0.01 m");
      expect(inch.scale).toBeCloseTo(0.0254);
      expect(foot.scale).toBeCloseTo(0.3048);
      expect(yard.scale).toBeCloseTo(0.9144);
      expect(mile.scale).toBeCloseTo(1609.344);
      expect(micron.scale * 1e6).toBe(1);
      expect(nanometer.scale * 1e9).toBe(1);
      expect(angstrom.scale * 1e10).toBeCloseTo(1);
    });
    it("mul by number", function() {
      var meter, yard;
      meter = new Unit(1, new Dimensions(0, 1, 0, 0, 0, 0, 0), labels);
      yard = meter.__mul__(2.54 * 36 / 100);
      expect(yard.toString()).toBe("0.9144 m");
    });
    it("mul by Unit", function() {
      var areaUnit, meter, second;
      meter = new Unit(1, new Dimensions(0, 1, 0, 0, 0, 0, 0), labels);
      second = new Unit(1, new Dimensions(0, 0, 1, 0, 0, 0, 0), labels);
      areaUnit = meter.mul(second);
      expect(meter.toString()).toBe("m");
      expect(second.toString()).toBe("s");
      expect(areaUnit.toString()).toBe("m s");
    });
    it("div by Unit", function() {
      var meter, second, speedUnit;
      meter = new Unit(1, new Dimensions(0, 1, 0, 0, 0, 0, 0), labels);
      second = new Unit(1, new Dimensions(0, 0, 1, 0, 0, 0, 0), labels);
      speedUnit = meter.div(second);
      expect(meter.toString()).toBe("m");
      expect(second.toString()).toBe("s");
      expect(speedUnit.toString()).toBe("m/s");
    });
    it("pow by number", function() {
      var meter, radian, square;
      meter = new Unit(1, new Dimensions(0, 1, 0, 0, 0, 0, 0), labels);
      square = meter.pow(Rational.TWO);
      radian = new Unit(1, new Dimensions(0, 0, 0, 0, 0, 0, 0), labels);
      expect(meter.toString()).toBe("m");
      expect(square.toString()).toBe("m ** 2");
    });
    it("inverse", function() {
      var dimensionless;
      dimensionless = new Unit(1234, new Dimensions(0, 0, 0, 0, 0, 0, 0), labels);
      expect(blade.units.unity.inverse().toString()).toBe("");
      expect(blade.units.meter.inverse().toString()).toBe("m ** -1");
      expect(blade.units.kilogram.inverse().toString()).toBe("kg ** -1");
      expect(blade.units.second.inverse().toString()).toBe("Hz");
      expect(blade.units.ampere.inverse().toString()).toBe("s C ** -1");
      expect(blade.units.kelvin.inverse().toString()).toBe("K ** -1");
      expect(blade.units.mole.inverse().toString()).toBe("mol ** -1");
      expect(blade.units.candela.inverse().toString()).toBe("cd ** -1");
    });
    it("electric current", function() {
      expect(blade.units.ampere.toString()).toBe("A");
    });
    it("electric charge", function() {
      expect(blade.units.coulomb.toString()).toBe("C");
    });
    it("force", function() {
      expect(blade.units.newton.toString()).toBe("N");
    });
    it("energy", function() {
      expect(blade.units.joule.toString()).toBe("J");
    });
    it("frequency", function() {
      expect(blade.units.hertz.toString()).toBe("Hz");
    });
    it("power", function() {
      expect(blade.units.watt.toString()).toBe("W");
    });
    it("electric potential", function() {
      expect(blade.units.volt.toString()).toBe("V");
    });
    it("electric field strength", function() {
      expect(blade.units.volt.div(blade.units.meter).toString()).toBe("V/m");
    });
    it("magnetic flux", function() {
      expect(blade.units.weber.toString()).toBe("Wb");
    });
    it("magnetic flux density", function() {
      expect(blade.units.tesla.toString()).toBe("T");
    });
    it("electrical resistance", function() {
      expect(blade.units.ohm.toString()).toBe("Ω");
    });
    it("electrical conductance", function() {
      expect(blade.units.siemen.toString()).toBe("S");
    });
    it("electrical capacitance", function() {
      expect(blade.units.farad.toString()).toBe("F");
    });
    it("electrical inductance", function() {
      expect(blade.units.henry.toString()).toBe("H");
    });
    it("electric permittivity", function() {
      expect(blade.units.farad.div(blade.units.meter).toString()).toBe("F/m");
    });
    it("electric permeability", function() {
      expect(blade.units.henry.div(blade.units.meter).toString()).toBe("H/m");
    });
    it("pressure, stress", function() {
      expect(blade.units.pascal.toString()).toBe("Pa");
    });
    it("angular momentum", function() {
      expect(blade.units.joule.mul(blade.units.second).toString()).toBe("J·s");
    });

    describe("Operator Overloading", function() {

      var m = blade.units.meter;
      var kg = blade.units.kilogram;
      var s = blade.units.second;

      describe("Binary +", function() {

        it("m.__add__(m)", function() {
          var actual = m.__add__(m);
          expect(actual.scale).toBe(2);
          expect(actual.dimensions.M.numer).toBe(0);
          expect(actual.dimensions.M.denom).toBe(1);
          expect(actual.dimensions.L.numer).toBe(1);
          expect(actual.dimensions.L.denom).toBe(1);
          expect(actual.dimensions.T.numer).toBe(0);
          expect(actual.dimensions.T.denom).toBe(1);
        });
        it("m.__radd__(m)", function() {
          var actual = m.__radd__(m);
          expect(actual.scale).toBe(2);
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
          expect(actual.scale).toBe(0);
          expect(actual.dimensions.M.numer).toBe(0);
          expect(actual.dimensions.M.denom).toBe(1);
          expect(actual.dimensions.L.numer).toBe(1);
          expect(actual.dimensions.L.denom).toBe(1);
          expect(actual.dimensions.T.numer).toBe(0);
          expect(actual.dimensions.T.denom).toBe(1);
        });

        it("m.__rsub__(m)", function() {
          var actual = m.__rsub__(m);
          expect(actual.scale).toBe(0);
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
          expect(actual.scale).toBe(1);
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
          expect(actual.scale).toBe(5);
          expect(actual.dimensions.M.numer).toBe(0);
          expect(actual.dimensions.M.denom).toBe(1);
          expect(actual.dimensions.L.numer).toBe(1);
          expect(actual.dimensions.L.denom).toBe(1);
          expect(actual.dimensions.T.numer).toBe(0);
          expect(actual.dimensions.T.denom).toBe(1);
        });

        it("m.__rmul__(m)", function() {
          var actual = m.__rmul__(m);
          expect(actual.scale).toBe(1);
          expect(actual.dimensions.M.numer).toBe(0);
          expect(actual.dimensions.M.denom).toBe(1);
          expect(actual.dimensions.L.numer).toBe(2);
          expect(actual.dimensions.L.denom).toBe(1);
          expect(actual.dimensions.T.numer).toBe(0);
          expect(actual.dimensions.T.denom).toBe(1);
        });

        it("5 * m", function() {
          var actual = m.__rmul__(5);
          expect(actual.scale).toBe(5);
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
          expect(actual.scale).toBe(1);
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
          expect(actual.scale).toBe(1/5);
          expect(actual.dimensions.M.numer).toBe(0);
          expect(actual.dimensions.M.denom).toBe(1);
          expect(actual.dimensions.L.numer).toBe(1);
          expect(actual.dimensions.L.denom).toBe(1);
          expect(actual.dimensions.T.numer).toBe(0);
          expect(actual.dimensions.T.denom).toBe(1);
        });

        it("m.__rdiv__(m)", function() {
          var actual = m.__rdiv__(m);
          expect(actual.scale).toBe(1);
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
          expect(actual.scale).toBe(5);
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

});
