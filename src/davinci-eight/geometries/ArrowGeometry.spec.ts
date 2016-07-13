import ArrowGeometry from './ArrowGeometry'

describe("ArrowGeometry", function() {
    describe("constructor", function() {
        it("should create a leaf Geometry", function() {
            const arrow = new ArrowGeometry()
            expect(arrow.isLeaf()).toBe(true)
            arrow.release()
        })
        describe("getPrincipalScale", function() {
            it("length", function() {
                const arrow = new ArrowGeometry()
                expect(arrow.getPrincipalScale('length')).toBe(1)
                arrow.release()
            })
        })
        describe("setPrincipalScale", function() {
            it("length", function() {
                const arrow = new ArrowGeometry()
                arrow.setPrincipalScale('length', 2)
                expect(arrow.getPrincipalScale('length')).toBe(2)
                arrow.release()
            })
        })
        describe("scaling", function() {
            it("length", function() {
                const arrow = new ArrowGeometry()
                const scaling = arrow.scaling
                expect(scaling.getElement(0, 0)).toBe(1)
                arrow.release()
            })
        })
    })
})
