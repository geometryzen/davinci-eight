import {Geometric3} from '../math/Geometric3'
import R3 from '../math/R3'
import setViewAttitude from './setViewAttitude'
import Spinor3 from '../math/Spinor3'

describe("setViewAttitude", function() {
  describe("(1, eye=e3, look=0, up=e2)", function() {
    const R = Spinor3.one()
    const eye = Geometric3.fromVector(R3.e3)
    const look = Geometric3.fromVector(R3.zero)
    const lookOriginal = look.clone()
    const up = Geometric3.fromVector(R3.e2)
    const upOriginal = up.clone()

    setViewAttitude(R, eye, look, up)

    it("should set eye to e3", function() {
      expect(eye.toString()).toBe(R3.e3.toString())
    })
    it("should leave look unchanged", function() {
      expect(look.toString()).toBe(lookOriginal.toString())
    })
    it("should leave up unchanged", function() {
      expect(up.toString()).toBe(upOriginal.toString())
    })
  })
  describe("(rotorFromDirections(e3, e1), eye=e3, look=0, up=e2)", function() {
    const R = Spinor3.rotorFromDirections(R3.e3, R3.e1)
    const eye = Geometric3.fromVector(R3.e3)
    const look = Geometric3.fromVector(R3.zero)
    const lookOriginal = look.clone()
    const up = Geometric3.fromVector(R3.e2)
    const upOriginal = up.clone()

    setViewAttitude(R, eye, look, up)

    it("should set eye to e1", function() {
      expect(eye.distanceTo(R3.e1)).toBeCloseTo(0, 15)
      expect(eye.normalize().toString()).toBe(R3.e1.toString())
    })
    it("should leave look unchanged", function() {
      expect(look.toString()).toBe(lookOriginal.toString())
    })
    it("should leave up unchanged", function() {
      expect(up.toString()).toBe(upOriginal.toString())
    })
  })
})
