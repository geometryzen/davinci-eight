import {Cylinder} from './Cylinder'

describe("Cylinder", function() {
  it("new-release", function() {
    const cylinder = new Cylinder()
    expect(cylinder.isZombie()).toBe(false)
    cylinder.release()
    expect(cylinder.isZombie()).toBe(true)
  })
})
