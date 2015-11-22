define(['davinci-eight/math/Mat2R'], function(Mat2R)
{
  describe("Mat2R", function() {
    describe("elements", function() {
      it("should be a Float32Array to support WebGL", function() {
        var m = new Mat2R(new Float32Array([1, 0, 0, 1]));
        expect(m.elements instanceof Float32Array).toBe(true);
      });
    });
  });
});