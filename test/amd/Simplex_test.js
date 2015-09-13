define(
[
  'davinci-eight/dfx/Simplex',
  'davinci-eight/dfx/Vertex',
  'davinci-eight/math/Vector3',
  'davinci-eight/core/Symbolic',
  'davinci-eight/dfx/triangle'
],
function(Simplex, Vertex, Vector3, Symbolic, triangle)
{
  describe("Simplex", function() {
    describe("constructor", function() {
      it("should set vertices", function() {
        var f = new Simplex(3);
        expect(f.vertices.length).toBe(3);
      });
      it("should set parents of vertices", function() {
        var A = new Vector3([0, 0, 0]);
        var B = new Vector3([1, 0, 0]);
        var C = new Vector3([0, 1, 0]);
        var f = triangle(A, B, C)[0];
        expect(f.vertices[0].parent).toBe(f);
        expect(f.vertices[1].parent).toBe(f);
        expect(f.vertices[2].parent).toBe(f);
      });
    });
  });
});