import CylinderGeometry from './CylinderGeometry'

describe("CylinderGeometry", function() {
    describe("constructor", function() {
        it("should create a container Geometry", function() {
            const cylinder = new CylinderGeometry()
            expect(cylinder.isLeaf()).toBe(false)
            cylinder.release()
        })
        it("should create a container Geometry", function() {
            const cylinder = new CylinderGeometry()
            expect(cylinder.isLeaf()).toBe(false)
            cylinder.release()
        })
        describe("radius property", function() {
            it("should default to unity", function() {
              const cylinder = new CylinderGeometry()
              expect(cylinder.radius).toBe(1)
              cylinder.release()
            })
            it("should be mutable", function() {
              const cylinder = new CylinderGeometry()
              cylinder.radius = 7
              expect(cylinder.radius).toBe(7)
              cylinder.release()
            })
            it("should be orthogonal to length", function() {
              const cylinder = new CylinderGeometry()
              cylinder.radius = 7
              expect(cylinder.radius).toBe(7)
              expect(cylinder.length).toBe(1)
              cylinder.release()
            })
        })
        describe("length property", function() {
            it("should default to unity", function() {
              const cylinder = new CylinderGeometry()
              expect(cylinder.length).toBe(1)
              cylinder.release()
            })
            it("should be mutable", function() {
              const cylinder = new CylinderGeometry()
              cylinder.length = 7
              expect(cylinder.length).toBe(7)
              cylinder.release()
            })
            it("should be orthogonal to radius", function() {
              const cylinder = new CylinderGeometry()
              cylinder.length = 7
              expect(cylinder.radius).toBe(1)
              expect(cylinder.length).toBe(7)
              cylinder.release()
            })
        })
        describe("getPrincipalScale", function() {
            it("radius", function() {
                const cylinder = new CylinderGeometry()
                expect(cylinder.getPrincipalScale('radius')).toBe(1)
                cylinder.release()
            })
        })
        describe("setPrincipalScale", function() {
            it("radius", function() {
                const cylinder = new CylinderGeometry()
                cylinder.setPrincipalScale('radius', 2)
                expect(cylinder.getPrincipalScale('radius')).toBe(2)
                cylinder.release()
            })
        })
        describe("scaling", function() {
            it("radius", function() {
                const cylinder = new CylinderGeometry()
                const scaling = cylinder.scaling
                expect(scaling.getElement(0, 0)).toBe(1)
                cylinder.release()
            })
        })
    })
})
