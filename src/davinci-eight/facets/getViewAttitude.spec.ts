import getViewAttitude from './getViewAttitude'
import R3 from '../math/R3'
import Spinor3 from '../math/Spinor3'

describe("getViewAttitude", function() {
  it("(eye=e3, look=0, up=e2) should be 1 because it is the reference configuration", function() {
    const eye = R3.e3
    const look = R3.zero
    const up = R3.e2
    const R = Spinor3.zero()
    getViewAttitude(eye, look, up, R)
    expect(R.isOne()).toBeTruthy()
  })
  describe("(eye=e1, look=0, up=e2)", function() {
    const eye = R3.e1
    const look = R3.zero
    const up = R3.e2
    const R = Spinor3.zero()
    getViewAttitude(eye, look, up, R)
    it("should be rotorFromDirections(e3, e1)", function() {
      expect(R.toString()).toBe(Spinor3.rotorFromDirections(R3.e3, R3.e1).toString())
    })
  })
})
