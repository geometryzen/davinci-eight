import Tetrahedron from './Tetrahedron'

describe("Tetrahedron", function() {
  it("new-release", function() {
    const arrow = new Tetrahedron()
    expect(arrow.isZombie()).toBe(false)
    arrow.release()
    expect(arrow.isZombie()).toBe(true)
  })
})
