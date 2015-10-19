define(['davinci-eight/topologies/GridTopology'], function(GridTopology)
{
  describe("GridTopology", function() {
    describe("[2, 1]", function() {
      it("should be traversed as a single triangle strip", function() {
        var topo = new GridTopology(2, 1);
        var primitive = topo.toDrawPrimitive();
        expect(primitive.indices.length).toBe(6);
        expect(primitive.indices[0]).toBe(0);
        expect(primitive.indices[1]).toBe(3);
        expect(primitive.indices[2]).toBe(1);
        expect(primitive.indices[3]).toBe(4);
        expect(primitive.indices[4]).toBe(2);
        expect(primitive.indices[5]).toBe(5);
        expect(topo.vertices.length).toBe(6);
      });
    }); 
    describe("[1, 2]", function() {
      it("should add degenerate traingles", function() {
        var topo = new GridTopology(1, 2);
        var primitive = topo.toDrawPrimitive();
        expect(primitive.indices.length).toBe(10);
        expect(primitive.indices[0]).toBe(0);
        expect(primitive.indices[1]).toBe(2);
        expect(primitive.indices[2]).toBe(1);
        expect(primitive.indices[3]).toBe(3);
        expect(primitive.indices[4]).toBe(3);
        expect(primitive.indices[5]).toBe(2);
        expect(primitive.indices[6]).toBe(2);
        expect(primitive.indices[7]).toBe(4);
        expect(primitive.indices[8]).toBe(3);
        expect(primitive.indices[9]).toBe(5);
        expect(topo.vertices.length).toBe(6);
      });
    }); 
 });
});