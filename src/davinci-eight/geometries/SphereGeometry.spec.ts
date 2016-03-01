import SphereGeometryOptions from './SphereGeometryOptions'
import SphereGeometry from './SphereGeometry'
import R3 from '../math/R3'
import Spinor3 from '../math/Spinor3'

describe("SphereGeometry", function() {
  describe("constructor", function() {
    it("should create a container Geometry", function() {
      const sphere = new SphereGeometry()
      expect(sphere.isLeaf()).toBe(false)
      sphere.release()
    })
    it("should create a container Geometry", function() {
      const sphere = new SphereGeometry()
      expect(sphere.isLeaf()).toBe(false)
      sphere.release()
    })
    describe("radius property", function() {
      it("should default to unity", function() {
        const sphere = new SphereGeometry()
        expect(sphere.radius).toBe(1)
        sphere.release()
      })
      it("should be mutable", function() {
        const sphere = new SphereGeometry()
        sphere.radius = 7
        expect(sphere.radius).toBe(7)
        sphere.release()
      })
    })
    describe("getPrincipalScale", function() {
      it("radius", function() {
        const sphere = new SphereGeometry()
        expect(sphere.getPrincipalScale('radius')).toBe(1)
        sphere.release()
      })
    })
    describe("setPrincipalScale", function() {
      it("radius", function() {
        const sphere = new SphereGeometry()
        sphere.setPrincipalScale('radius', 2)
        expect(sphere.getPrincipalScale('radius')).toBe(2)
        sphere.release()
      })
    })
    describe("scaling", function() {
      it("radius", function() {
        const sphere = new SphereGeometry()
        const scaling = sphere.scaling
        expect(scaling.getElement(0, 0)).toBe(1)
        sphere.release()
      })
      it("radius should be in all diagonal elements", function() {
        const options: SphereGeometryOptions = {}
        options.tilt = Spinor3.one()
        const sphere = new SphereGeometry(options)
        sphere.setPrincipalScale('radius', 5)
        const scaling = sphere.scaling
        expect(scaling.getElement(0, 0)).toBe(5)
        expect(scaling.getElement(1, 1)).toBe(5)
        expect(scaling.getElement(2, 2)).toBe(5)
        sphere.release()
      })
      it("radius should be in all diagonal elements", function() {
        const options: SphereGeometryOptions = {}
        options.tilt = Spinor3.rotorFromDirections(R3.e2, R3.e3)
        const sphere = new SphereGeometry(options)
        sphere.setPrincipalScale('radius', 5)
        const scaling = sphere.scaling
        expect(scaling.getElement(0, 0)).toBe(5)
        expect(scaling.getElement(1, 1)).toBe(5)
        expect(scaling.getElement(2, 2)).toBe(5)
        sphere.release()
      })
    })
  })
})
