define(['davinci-eight/math/Matrix2'], function(Matrix2)
{
  describe("Matrix2", function() {
    describe("data", function() {
      it("should be a Float32Array to support WebGL", function() {
        var m = new Matrix2(new Float32Array([1, 0, 0, 1]));
        expect(m.data instanceof Float32Array).toBe(true);
      });
    });
  });
});