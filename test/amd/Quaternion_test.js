define(
[
  'davinci-eight/math/Quaternion',
],
function(Quaternion)
{
  describe("Quaternion", function() {
    describe("constructor", function() {
      it("data argument should be preserved", function() {
        var q = new Quaternion(2, {x: 3,y: 5,z: 7});
        expect(q.t).toBe(2);
        expect(q.v.x).toBe(3);
        expect(q.v.y).toBe(5);
        expect(q.v.z).toBe(7);
      });
      it("no argument should create identity", function() {
        var q = new Quaternion();
        expect(q.t).toBe(1);
        expect(q.v.x).toBe(0);
        expect(q.v.y).toBe(0);
        expect(q.v.z).toBe(0);
      });
    });
    describe("copy", function() {
      it("should preserve values", function() {
        var source = new Quaternion(2, {x: 3,y: 5,z: 7});
        var q = new Quaternion().copy(source);
        expect(q.t).toBe(2);
        expect(q.v.x).toBe(3);
        expect(q.v.y).toBe(5);
        expect(q.v.z).toBe(7);
      });
    });
    describe("exp", function() {
      it("should preserve the identity", function() {
        var source = new Quaternion(1, {x: 0,y: 0,z: 0});
        var q = source.exp();
        expect(q.t).toBe(Math.exp(1));
        expect(q.v.x).toBe(0);
        expect(q.v.y).toBe(0);
        expect(q.v.z).toBe(0);
      });
      it("should correspond with scalar exponentiation", function() {
        var q = new Quaternion(3);
        var clone = q.clone();
        q.exp();
        expect(q.t).toBe(Math.exp(3));
        expect(q.v.x).toBe(0);
        expect(q.v.y).toBe(0);
        expect(q.v.z).toBe(0);
      });
    });
    describe("scale", function() {
      it("should multiply each coordinate by the scalar value", function() {
        var original = new Quaternion(2, {x: 3, y: 5, z: 7});
        var q = original.clone()
        var α = 2;//Math.random()
        q.scale(α)
        expect(q.t).toBe(original.t * α);
        expect(q.v.x).toBe(original.v.x * α);
        expect(q.v.y).toBe(original.v.y * α);
        expect(q.v.z).toBe(original.v.z * α);
      });
    });
  });
});