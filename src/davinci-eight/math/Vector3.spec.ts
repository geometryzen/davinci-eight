import Vector3 from './Vector3'

describe("Vector3", function() {
  describe("constructor", function() {
    const data = [Math.random(), Math.random(), Math.random()]
    const vec = new Vector3(data, false)
    it("getComponent(0)", function() {
      expect(vec.getComponent(0)).toBe(data[0])
    })
    it("getComponent(1)", function() {
      expect(vec.getComponent(1)).toBe(data[1])
    })
    it("getComponent(2)", function() {
      expect(vec.getComponent(2)).toBe(data[2])
    })
  })
  describe("maskG3", function() {
    it("should be 0x2 for non-zero vectors", function() {
      expect(Vector3.vector(1, 0, 0).maskG3).toBe(0x2)
      expect(Vector3.vector(0, 1, 0).maskG3).toBe(0x2)
      expect(Vector3.vector(0, 0, 1).maskG3).toBe(0x2)
    })
    it("should be 0x0 for the zero vector", function() {
      expect(Vector3.vector(0, 0, 0).maskG3).toBe(0x0)
    })
  })
})
