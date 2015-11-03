define(['davinci-eight/math/Matrix3'], function(Matrix3)
{
  describe("Matrix3", function() {
    describe("elements", function() {
      it("should be a Float32Array to support WebGL", function() {
        var m = new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        expect(m.elements instanceof Float32Array).toBe(true);
      });
    });
  });
});