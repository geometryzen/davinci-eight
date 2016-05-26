import createView from './createView'
import {Geometric3} from '../math/Geometric3'
import R3 from '../math/R3'
import Vector3 from '../math/Vector3'

const zero = R3.zero
const e2 = R3.e2
const e3 = R3.e3

describe("createView", function() {
  describe("() should create a view", function() {
    const view = createView()
    it("should create a view", function() {
      expect(view).toBeDefined()
    })
    // The primary state is eye, look, and up.
    it("should default 'eye' to e3", function() {
      expect(view.eye.equals(Geometric3.fromVector(e3))).toBeTruthy()
    })
    it("should default 'position' to e3", function() {
      expect(Vector3.copy(view.eye).equals(Vector3.vector(0, 0, 1))).toBeTruthy()
    })
    it("should default 'look' to 0", function() {
      expect(view.look.equals(Geometric3.fromVector(zero))).toBeTruthy()
    })
    it("should default 'up' to e2", function() {
      expect(view.up.equals(Geometric3.fromVector(e2))).toBeTruthy()
    })
  })
})
