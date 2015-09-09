define(['davinci-eight/math/VectorN'], function(VectorN)
{
  describe("VectorN", function() {
    describe("constructor", function() {
      var data = [Math.random(), Math.random(), Math.random()];
      var vec = new VectorN(data, false, 3);
      it("getComponent(0)", function() {
        expect(vec.getComponent(0)).toBe(data[0]);
      });
      it("getComponent(1)", function() {
        expect(vec.getComponent(1)).toBe(data[1]);
      });
      it("getComponent(2)", function() {
        expect(vec.getComponent(2)).toBe(data[2]);
      });
    });
  });
});