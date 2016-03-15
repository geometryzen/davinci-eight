import createView from './createView'
import R3 from '../math/R3'
import Spinor3 from '../math/Spinor3'
import Vector3 from '../math/Vector3'

const zero = R3.zero
const e1 = R3.e1
const e2 = R3.e2
const e3 = R3.e3
const precision = 6

describe("createView", function() {
  describe("() should create a view", function() {
    const view = createView()
    it("should create a view", function() {
      expect(view).toBeDefined()
    })
    // The primary state is eye, look, and up.
    it("should default 'eye' to e3", function() {
      expect(view.eye.equals(Vector3.vector(0, 0, 1))).toBeTruthy()
    })
    it("should default 'position' to e3", function() {
      expect(Vector3.copy(view.getPosition()).equals(Vector3.vector(0, 0, 1))).toBeTruthy()
    })
    it("should default 'look' to 0", function() {
      expect(view.look.equals(Vector3.vector(0, 0, 0))).toBeTruthy()
    })
    it("should default 'up' to e2", function() {
      expect(view.up.equals(Vector3.copy(e2))).toBeTruthy()
    })
    it("should default 'attitude' to 1", function() {
      expect(Spinor3.copy(view.getAttitude()).toString()).toBe('1')
      expect(Spinor3.copy(view.getAttitude()).equals(Spinor3.spinor(0, 0, 0, 1))).toBeTruthy()
    })
    /*
    view.setAttitude
    view.setEye
    view.setLook
    view.setPosition
    view.setProperty
    view.setUniforms
    view.setUp
    */
  })
  describe("setAttitude", function() {
    it("(1) should leave view unchanged.", function() {
      const view = createView()
      view.setAttitude(Spinor3.one())
      expect(view.eye.equals(Vector3.vector(0, 0, 1))).toBeTruthy()
      expect(view.look.equals(Vector3.vector(0, 0, 0))).toBeTruthy()
      expect(view.up.equals(Vector3.vector(0, 1, 0))).toBeTruthy()
    })
    describe("(e3 -> e1)", function() {
      const view = createView()
      view.setAttitude(Spinor3.rotorFromDirections(e3, e1))
      it("should change eye to e1", function() {
        expect(view.eye.distanceTo(e1)).toBeCloseTo(0, precision)
      })
      it("should leave look as origin", function() {
        expect(view.look.distanceTo(zero)).toBeCloseTo(0, precision)
      })
      it("should leave up as e2", function() {
        expect(view.up.distanceTo(e2)).toBeCloseTo(0, precision)
      })
    })
    describe("(e3 -> -e1)", function() {
      const view = createView()
      view.setAttitude(Spinor3.rotorFromDirections(e3, e1.neg()))
      it("should change eye to -e1", function() {
        expect(view.eye.distanceTo(e1.neg())).toBeCloseTo(0, precision)
      })
      it("should leave look as origin", function() {
        expect(view.look.distanceTo(zero)).toBeCloseTo(0, precision)
      })
      it("should leave up as e2", function() {
        expect(view.up.distanceTo(e2)).toBeCloseTo(0, precision)
      })
    })
    describe("(e3 -> e3 + e2)", function() {
      const view = createView()
      view.setAttitude(Spinor3.rotorFromDirections(e3, Vector3.copy(e3).add(e2)))
      it("should change eye to (e3+e2)/sqrt(2)", function() {
        const X = Vector3.copy(e3).add(e2).normalize()
        expect(view.eye.distanceTo(X)).toBeCloseTo(0, precision)
      })
      it("should leave look as origin", function() {
        expect(view.look.distanceTo(zero)).toBeCloseTo(0, precision)
      })
      it("should leave up as e2", function() {
        expect(view.up.distanceTo(e2)).toBeCloseTo(0, precision)
      })
    })
  })
})
