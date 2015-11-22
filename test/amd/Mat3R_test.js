define(['davinci-eight/math/Mat3R'], function(Mat3R)
{
  describe("Mat3R", function() {
    describe("elements", function() {
      it("should be a Float32Array to support WebGL", function() {
        var m = new Mat3R(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        expect(m.elements instanceof Float32Array).toBe(true);
      });
    });
  });
});