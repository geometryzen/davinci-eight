define(
[
  'davinci-eight/dfx/Simplex',
  'davinci-eight/dfx/Vertex',
  'davinci-eight/math/Vector3'
],
function(Simplex, Vertex, Vector3)
{
  describe("Simplex", function() {
    describe("constructor", function() {
      it("should set vertices", function() {
        var A = new Vector3([0, 0, 0]);
        var B = new Vector3([1, 0, 0]);
        var C = new Vector3([0, 1, 0]);
        var f = new Simplex([A, B, C]);
        expect(f.vertices[0].position).toBe(A);
        expect(f.vertices[1].position).toBe(B);
        expect(f.vertices[2].position).toBe(C);
      });
      it("should set parents of vertices", function() {
        var A = new Vector3([0, 0, 0]);
        var B = new Vector3([1, 0, 0]);
        var C = new Vector3([0, 1, 0]);
        var f = new Simplex([A, B, C]);
        expect(f.vertices[0].parent).toBe(f);
        expect(f.vertices[1].parent).toBe(f);
        expect(f.vertices[2].parent).toBe(f);
      });
    });
  });
});