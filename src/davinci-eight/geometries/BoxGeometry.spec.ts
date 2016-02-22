import BoxGeometry from './BoxGeometry'

describe("BoxGeometry", function() {
    describe("constructor", function() {
        it("should create a container Geometry", function() {
            const box = new BoxGeometry()
            expect(box.isLeaf()).toBe(false)
            box.release()
        })
    })
})
