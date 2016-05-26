import {Curve} from './Curve'

describe("Curve", function() {
  it("new-release", function() {
    const curve = new Curve()
    expect(curve.isZombie()).toBe(false)
    curve.release()
    expect(curve.isZombie()).toBe(true)
  })
})
