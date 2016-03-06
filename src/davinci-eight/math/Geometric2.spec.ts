import Geometric2 from './Geometric2'

describe("Geometric2", function() {
  describe("static one()", function() {
    const one: Geometric2 = Geometric2.one()
    it("should be te scalar 1", function() {
      expect(one.α).toBe(1)
      expect(one.x).toBe(0)
      expect(one.y).toBe(0)
      expect(one.β).toBe(0)
    })
  })
})
