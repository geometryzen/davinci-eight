define(
[
  'davinci-eight/dfx/Simplex3',
  'davinci-eight/dfx/Simplex3Vertex',
  'davinci-eight/math/Vector3'
],
function(Simplex3, Simplex3Vertex, Vector3)
{
  describe("Simplex3", function() {
    describe("constructor", function() {
      it("should set a, b, c", function() {
        var A = new Vector3([0, 0, 0]);
        var B = new Vector3([1, 0, 0]);
        var C = new Vector3([0, 1, 0]);
        var f = new Simplex3(A, B, C);
        // Usual construction stuff.
        expect(f.a.position).toBe(A);
        expect(f.b.position).toBe(B);
        expect(f.c.position).toBe(C);
      });
      it("should set parents of a, b, c", function() {
        var A = new Vector3([0, 0, 0]);
        var B = new Vector3([1, 0, 0]);
        var C = new Vector3([0, 1, 0]);
        var f = new Simplex3(A, B, C);
        // Usual construction stuff.
        expect(f.a.parent).toBe(f);
        expect(f.b.parent).toBe(f);
        expect(f.c.parent).toBe(f);
      });
      it("should compute face normal (dynamically)", function() {
        var A = new Vector3([0, 0, 0]);
        var B = new Vector3([1, 0, 0]);
        var C = new Vector3([0, 1, 0]);
        var f = new Simplex3(A, B, C);

        expect(f.normal.x).toBe(0);
        expect(f.normal.y).toBe(0);
        expect(f.normal.z).toBe(1);

        f.c.position.set(0, 0, 1);

        expect(f.normal.x).toBe(0);
        expect(f.normal.y).toBe(-1);
        expect(f.normal.z).toBe(0);
      });
      it("should compute vertex normals (dynamically)", function() {
        var A = new Vector3([0, 0, 0]);
        var B = new Vector3([1, 0, 0]);
        var C = new Vector3([0, 1, 0]);
        var f = new Simplex3(A, B, C);

        expect(f.a.normal.x).toBe(0);
        expect(f.a.normal.y).toBe(0);
        expect(f.a.normal.z).toBe(1);

        f.c.position.set(0, 0, 1);

        expect(f.a.normal.x).toBe(0);
        expect(f.a.normal.y).toBe(-1);
        expect(f.a.normal.z).toBe(0);
      });
    });
  });
});