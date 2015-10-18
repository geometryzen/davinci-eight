define(
[
  'davinci-eight/geometries/Simplex',
  'davinci-eight/geometries/Vertex',
  'davinci-eight/math/Vector3',
  'davinci-eight/core/Symbolic',
  'davinci-eight/geometries/triangle'
],
function(Simplex, Vertex, Vector3, Symbolic, triangle)
{
  describe("Simplex", function() {
    describe("constructor", function() {
      it("should set vertices for an empty simplex", function() {
        var f = new Simplex(Simplex.EMPTY);
        expect(f.vertices.length).toBe(0);
      });
      it("should set vertices for 0-simplex", function() {
        var f = new Simplex(Simplex.POINT);
        expect(f.vertices.length).toBe(1);
      });
      it("should set vertices for 1-simplex", function() {
        var f = new Simplex(Simplex.LINE);
        expect(f.vertices.length).toBe(2);
      });
      it("should set vertices for 2-simplex", function() {
        var f = new Simplex(Simplex.TRIANGLE);
        expect(f.vertices.length).toBe(3);
      });
    });
  });
});