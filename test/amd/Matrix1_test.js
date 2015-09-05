define(['davinci-eight/math/Matrix1'], function(Matrix1)
{
  describe("Matrix1", function() {
    describe("data", function() {
      it("should be a Float32Array to support WebGL", function() {
        var m = new Matrix1(new Float32Array([1]));
        expect(m.data instanceof Float32Array).toBe(true);
      });
    });
  });
});