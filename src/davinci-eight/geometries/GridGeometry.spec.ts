import GridGeometry from './GridGeometry'

describe("GridGeometry", function() {
  it("new-release", function() {
    const geometry = new GridGeometry()
    expect(geometry.isZombie()).toBe(false)
    geometry.release()
    expect(geometry.isZombie()).toBe(true)
  })
})
