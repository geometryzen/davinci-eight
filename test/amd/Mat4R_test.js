define(['davinci-eight/math/Mat4R'], function(Mat4R) {

  Mat4R = Mat4R.default

  describe("Mat4R", function() {
    describe("elements", function() {
      it("should be a Float32Array to support WebGL", function() {
        var m = new Mat4R(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
        expect(m.elements instanceof Float32Array).toBe(true);
      });
    });
  });
});