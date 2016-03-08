import CurveGeometry from './CurveGeometry'

describe("CurveGeometry", function() {
  it("new-release", function() {
    const geometry = new CurveGeometry()
    expect(geometry.isZombie()).toBe(false)
    geometry.release()
    expect(geometry.isZombie()).toBe(true)
  })
})
