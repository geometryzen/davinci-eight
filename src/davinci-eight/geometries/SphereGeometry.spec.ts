import SphereGeometry from './SphereGeometry'

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
        })
    })
})
