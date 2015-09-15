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
      it("should set vertices for an empty simplex", function() {
        var f = new Simplex(Simplex.K_FOR_EMPTY);
        expect(f.vertices.length).toBe(0);
      });
      it("should set vertices for 0-simplex", function() {
        var f = new Simplex(Simplex.K_FOR_POINT);
        expect(f.vertices.length).toBe(1);
      });
      it("should set vertices for 1-simplex", function() {
        var f = new Simplex(Simplex.K_FOR_LINE_SEGMENT);
        expect(f.vertices.length).toBe(2);
      });
      it("should set vertices for 2-simplex", function() {
        var f = new Simplex(Simplex.K_FOR_TRIANGLE);
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