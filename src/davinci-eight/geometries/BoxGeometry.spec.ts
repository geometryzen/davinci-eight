import BoxGeometry from './BoxGeometry'
import BoxGeometryOptions from './BoxGeometryOptions'
import R3 from '../math/R3'
import Spinor3 from '../math/Spinor3'

describe("BoxGeometry", function() {
  describe("constructor", function() {
    it("should create a container Geometry", function() {
      const box = new BoxGeometry()
      expect(box.isLeaf()).toBe(false)
      box.release()
    })
  })
  describe("scaling", function() {
    it("scaling should be 1 when no tilt supplied", function() {
      const options: BoxGeometryOptions = {}
      const geometry = new BoxGeometry(options)
      expect(geometry.scaling.isOne()).toBe(true)
    })
    it("scaling should be 1 when tilt is 1", function() {
      const options: BoxGeometryOptions = {}
      options.tilt = Spinor3.one()
      const geometry = new BoxGeometry(options)
      expect(geometry.scaling.isOne()).toBe(true)
    })
    it("scaling should coincide with canonical configuration when tilt is 1", function() {
      const options: BoxGeometryOptions = {}
      options.tilt = Spinor3.one()
      const geometry = new BoxGeometry(options)
      geometry.setPrincipalScale('width', 2)
      geometry.setPrincipalScale('height', 3)
      geometry.setPrincipalScale('depth', 5)
      expect(geometry.scaling.getElement(0, 0)).toBe(2)
      expect(geometry.scaling.getElement(1, 1)).toBe(3)
      expect(geometry.scaling.getElement(2, 2)).toBe(5)
    })
    it("scaling should exchange x and y when rotor is e2 ^ e1", function() {
      const options: BoxGeometryOptions = {}
      options.tilt = Spinor3.rotorFromDirections(R3.e2, R3.e1)
      const geometry = new BoxGeometry(options)
      geometry.setPrincipalScale('width', 2)
      geometry.setPrincipalScale('height', 3)
      geometry.setPrincipalScale('depth', 5)
      expect(geometry.scaling.getElement(0, 0)).toBe(3)
      expect(geometry.scaling.getElement(1, 1)).toBe(2)
      expect(geometry.scaling.getElement(2, 2)).toBe(5)
    })
    it("scaling should exchange y and z when rotor is e3 ^ e2", function() {
      const options: BoxGeometryOptions = {}
      options.tilt = Spinor3.rotorFromDirections(R3.e3, R3.e2)
      const geometry = new BoxGeometry(options)
      geometry.setPrincipalScale('width', 2)
      geometry.setPrincipalScale('height', 3)
      geometry.setPrincipalScale('depth', 5)
      expect(geometry.scaling.getElement(0, 0)).toBe(2)
      expect(geometry.scaling.getElement(1, 1)).toBe(5)
      expect(geometry.scaling.getElement(2, 2)).toBe(3)
    })
    it("scaling should exchange z and x when rotor is e1 ^ e3", function() {
      const options: BoxGeometryOptions = {}
      options.tilt = Spinor3.rotorFromDirections(R3.e1, R3.e3)
      const geometry = new BoxGeometry(options)
      geometry.setPrincipalScale('width', 2)
      geometry.setPrincipalScale('height', 3)
      geometry.setPrincipalScale('depth', 5)
      expect(geometry.scaling.getElement(0, 0)).toBe(5)
      expect(geometry.scaling.getElement(1, 1)).toBe(3)
      expect(geometry.scaling.getElement(2, 2)).toBe(2)
    })
    it("scaling should cycle x -> z -> y -> x when rotor is e1 ^ e2 followed by e2 ^ e3", function() {
      const options: BoxGeometryOptions = {}
      const s1 = Spinor3.rotorFromDirections(R3.e1, R3.e2)
      const s2 = Spinor3.rotorFromDirections(R3.e2, R3.e3)
      options.tilt = s2.clone().mul(s1)
      const geometry = new BoxGeometry(options)
      geometry.setPrincipalScale('width', 2)
      geometry.setPrincipalScale('height', 3)
      geometry.setPrincipalScale('depth', 5)
      expect(geometry.scaling.getElement(0, 0)).toBe(3)
      expect(geometry.scaling.getElement(1, 1)).toBe(5)
      expect(geometry.scaling.getElement(2, 2)).toBe(2)
    })
  })
})
