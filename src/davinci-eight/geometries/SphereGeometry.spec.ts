import SphereGeometry from './SphereGeometry'

describe("SphereGeometry", function() {
    describe("constructor", function() {
        it("should create a container Geometry", function() {
            const arrow = new SphereGeometry()
            expect(arrow.isLeaf()).toBe(false)
            arrow.release()
        })
        it("should create a container Geometry", function() {
            const arrow = new SphereGeometry()
            expect(arrow.isLeaf()).toBe(false)
            arrow.release()
        })
        describe("radius property", function() {
            it("should default to unity", function() {
              const arrow = new SphereGeometry()
              expect(arrow.radius).toBe(1)
              arrow.release()
            })
            it("should be mutable", function() {
              const arrow = new SphereGeometry()
              arrow.radius = 7
              expect(arrow.radius).toBe(7)
              arrow.release()
            })
        })
        describe("getPrincipalScale", function() {
            it("radius", function() {
                const arrow = new SphereGeometry()
                expect(arrow.getPrincipalScale('radius')).toBe(1)
                arrow.release()
            })
        })
        describe("setPrincipalScale", function() {
            it("radius", function() {
                const arrow = new SphereGeometry()
                arrow.setPrincipalScale('radius', 2)
                expect(arrow.getPrincipalScale('radius')).toBe(2)
                arrow.release()
            })
        })
        describe("scaling", function() {
            it("radius", function() {
                const arrow = new SphereGeometry()
                const scaling = arrow.scaling
                expect(scaling.getElement(0, 0)).toBe(1)
                arrow.release()
            })
        })
    })
})
