define(['davinci-eight/math/SpinG3'], function(SpinG3)
{
  describe("SpinG3", function() {
    describe("constructor", function() {
      it("data argument should be preserved", function() {
        var data = [1, 2, 3, 4];
        var m = new SpinG3(data);
        expect(m.data).toBe(data);
        expect(m.data[0]).toBe(data[0]);
        expect(m.data[1]).toBe(data[1]);
        expect(m.data[2]).toBe(data[2]);
        expect(m.data[3]).toBe(data[3]);
        expect(m.modified).toBe(false);
      });
      it("no argument should create identity", function() {
        var m = new SpinG3();
        expect(m.data[0]).toBe(0);
        expect(m.data[1]).toBe(0);
        expect(m.data[2]).toBe(0);
        expect(m.data[3]).toBe(1);
        expect(m.modified).toBe(false);
      });
    });
    describe("copy", function() {
      it("should preserved values and set modified flag", function() {
        var source = new SpinG3([1, 2, 3, 4]);
        var m = new SpinG3().copy(source);
        expect(m.data[0]).toBe(1);
        expect(m.data[1]).toBe(2);
        expect(m.data[2]).toBe(3);
        expect(m.data[3]).toBe(4);
        expect(m.modified).toBe(true);
      });
      it("should preserved modified flag when no change", function() {
        var source = new SpinG3([0, 0, 0, 1]);
        var m = new SpinG3().copy(source);
        expect(m.data[0]).toBe(0);
        expect(m.data[1]).toBe(0);
        expect(m.data[2]).toBe(0);
        expect(m.data[3]).toBe(1);
        expect(m.modified).toBe(false);
      });
    });
    describe("exp", function() {
      it("should preserve the identity", function() {
        var m = new SpinG3([0, 0, 0, 1]);
        var r = m.exp();
        expect(m.data[0]).toBe(0);
        expect(m.data[1]).toBe(0);
        expect(m.data[2]).toBe(0);
        expect(m.data[3]).toBe(Math.exp(1));
        expect(m.modified).toBe(true);
        expect(r).toBe(m);
      });
      it("should correspond with scalar exponentiation", function() {
        var m = new SpinG3([0, 0, 0, 3]);
        var clone = m.clone();
        m.exp();
        expect(m.data[0]).toBe(0);
        expect(m.data[1]).toBe(0);
        expect(m.data[2]).toBe(0);
        expect(m.w).toBe(Math.exp(clone.w));
        expect(m.modified).toBe(true);
      });
    });
    describe("scale", function() {
      it("should multiply each coordinate by the scalar value", function() {
        var m = new SpinG3([2, 3, 5, 7]).scale(2);
        expect(m.data[0]).toBe(4);
        expect(m.data[1]).toBe(6);
        expect(m.data[2]).toBe(10);
        expect(m.data[3]).toBe(14);
        expect(m.modified).toBe(true);
      });
    });
  });
});