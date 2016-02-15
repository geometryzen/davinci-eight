define(['davinci-eight/math/SpinG3'], function(SpinG3) {


  SpinG3 = SpinG3.default

  describe("SpinG3", function() {
    describe("constructor", function() {
      it("coords argument should be preserved", function() {
        var coords = [1, 2, 3, 4];
        var m = new SpinG3(coords);
        expect(m.coords).toBe(coords);
        expect(m.coords[0]).toBe(coords[0]);
        expect(m.coords[1]).toBe(coords[1]);
        expect(m.coords[2]).toBe(coords[2]);
        expect(m.coords[3]).toBe(coords[3]);
        expect(m.modified).toBe(false);
      });
      it("no argument should create identity", function() {
        var m = new SpinG3();
        expect(m.coords[0]).toBe(0);
        expect(m.coords[1]).toBe(0);
        expect(m.coords[2]).toBe(0);
        expect(m.coords[3]).toBe(1);
        expect(m.modified).toBe(false);
      });
    });
    describe("copy", function() {
      it("should preserved values and set modified flag", function() {
        var source = new SpinG3([1, 2, 3, 4]);
        var m = new SpinG3().copy(source);
        expect(m.coords[0]).toBe(1);
        expect(m.coords[1]).toBe(2);
        expect(m.coords[2]).toBe(3);
        expect(m.coords[3]).toBe(4);
        expect(m.modified).toBe(true);
      });
      it("should preserved modified flag when no change", function() {
        var source = new SpinG3([0, 0, 0, 1]);
        var m = new SpinG3().copy(source);
        expect(m.coords[0]).toBe(0);
        expect(m.coords[1]).toBe(0);
        expect(m.coords[2]).toBe(0);
        expect(m.coords[3]).toBe(1);
        expect(m.modified).toBe(false);
      });
    });
    describe("exp", function() {
      it("should preserve the identity", function() {
        var m = new SpinG3([0, 0, 0, 1]);
        var r = m.exp();
        expect(m.coords[0]).toBe(0);
        expect(m.coords[1]).toBe(0);
        expect(m.coords[2]).toBe(0);
        expect(m.coords[3]).toBe(Math.exp(1));
        expect(m.modified).toBe(true);
        expect(r).toBe(m);
      });
      it("should correspond with scalar exponentiation", function() {
        var m = new SpinG3([0, 0, 0, 3]);
        var clone = m.clone();
        m.exp();
        expect(m.coords[0]).toBe(0);
        expect(m.coords[1]).toBe(0);
        expect(m.coords[2]).toBe(0);
        expect(m.α).toBe(Math.exp(clone.α));
        expect(m.modified).toBe(true);
      });
    });
    describe("scale", function() {
      it("should multiply each coordinate by the scalar value", function() {
        var m = new SpinG3([2, 3, 5, 7]).scale(2);
        expect(m.coords[0]).toBe(4);
        expect(m.coords[1]).toBe(6);
        expect(m.coords[2]).toBe(10);
        expect(m.coords[3]).toBe(14);
        expect(m.modified).toBe(true);
      });
    });
  });
});